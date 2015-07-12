import dbg from 'debug';
import { Rx } from '@cycle/core';
import { h } from '@cycle/web';
import L from 'leaflet';

var debug = dbg('app:components:background');

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
  var map = L.map(node, {
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    zoomControl: false,
    center: [0, 0,]
  }).setView([51.505, -0.09], 18);

  var s = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    id: 'stwind.05303e06',
    accessToken: 'pk.eyJ1Ijoic3R3aW5kIiwiYSI6IjFiYzQwY2ZmMjk5YzdjYjMzMTllYTg5NWNiZjM3MjU4In0.SSNQkMgoc2kiqsaSqg9pKg'
  }).addTo(map);

  debug(s);
};

Hook.prototype.unhook = function unhook(node) {
  debug('unhooked');
};
