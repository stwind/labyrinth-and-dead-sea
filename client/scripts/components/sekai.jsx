import dbg from 'debug';
import { Rx } from '@cycle/core';
import { h } from '@cycle/web';
import L from 'leaflet';
import Tweenable from 'shifty';

var debug = dbg('app:components:sekai');

function intent ({ dom }) {
  return { };
}

function model (context, user) {
  let state$ = Rx.Observable.just({});
  let props$ = context.props.getAll();
  return props$.combineLatest(state$, (props, state) => ({ props, state }));
}

function view (model$) {
  return model$.map(render);
}

function render ({ props, state }) {
  return (
    <div className="sekai" hook={new Hook()}>
    </div>
  );
}

export default function background (responses) {
  var actions = intent(responses);

  return {
    dom: view(model(responses, actions)),
    events: {
    }
  };
}

function Hook() {}

Hook.prototype.hook = function hook(node) {
  var tweenable = new Tweenable();
  // var center = [51.505, -0.09];
  var center = [36.174, 120.453];

  var map = L.map(node, {
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    zoomControl: false,
    attributionControl: false,
    center: [0, 0,]
  }).setView(center, 17);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    id: 'mapbox.streets-satellite',
    accessToken: 'pk.eyJ1Ijoic3R3aW5kIiwiYSI6IjFiYzQwY2ZmMjk5YzdjYjMzMTllYTg5NWNiZjM3MjU4In0.SSNQkMgoc2kiqsaSqg9pKg'
  }).addTo(map);

  var myIcon = L.divIcon({className: 'peer'});
  var marker = L.marker(center, {icon: myIcon}).addTo(map);

  map.on('moveend', e => {
    var oldLatLng = marker.getLatLng();
    var newLatLng = e.target.getCenter();
    tweenable.stop().tween({
      from: { lat: oldLatLng.lat, lng: oldLatLng.lng },
      to: { lat: newLatLng.lat, lng: newLatLng.lng },
      duration: 1000,
      step({ lat, lng }) {
        marker.setLatLng(L.latLng([lat, lng]));
        dark.update();
      }
    });
  });

  var dark = new DarkLayer([marker]);

  map.addLayer(dark);
};

Hook.prototype.unhook = function unhook(node) {
  debug('unhooked');
};

var DarkLayer = L.Class.extend({
  initialize(markers) {
    this._markers = markers;
  },

  onAdd(map) {
    this._map = map;
    this._initCanvas();
    map.getPanes().overlayPane.appendChild(this._canvas);
    map.on('viewreset', this._draw, this);
    map.on('move', this._move, this);
    this._draw();
  },

  onRemove(map) {
    map.getPanes().overlayPane.removeChild(this._canvas);
    map.off('viewreset', this._draw, this);
    map.off('move', this._move, this);
  },

  update() {
    this._draw();
  },

  _initCanvas() {
    if (!this._canvas) {
      this._canvas = L.DomUtil.create('canvas', 'leaflet-dark-layer leaflet-layer');
      var size = this._map.getSize();
      this._canvas.width  = size.x;
      this._canvas.height = size.y;

      this._ctx = this._canvas.getContext('2d');
    }
  },

  _draw() {
    this._canvas.width = this._canvas.width
    var ctx = this._ctx;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this._markers.forEach(m => {
      var point = this._map.latLngToContainerPoint(m.getLatLng());
      this._drawLight(Math.floor(point.x), Math.floor(point.y), 250);
    });
  },

  _drawLight(x, y, r) {
    var ctx = this._ctx;

    var gradient = ctx.createRadialGradient(x, y, r, x, y, 0);
    gradient.addColorStop(0,'rgba(0,0,0,0)');
    gradient.addColorStop(0.3,'rgba(0,0,0,0.5)');
    gradient.addColorStop(1,'rgba(0,0,0,1)');

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = gradient;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  _move() {
    var topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);
    this._draw();
  }
});
