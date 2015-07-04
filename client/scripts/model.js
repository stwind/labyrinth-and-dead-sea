import dbg from 'debug';
import { Rx } from 'cyclejs';
import { fromJS, Map } from 'immutable';

var debug = dbg('app:model');

export function initial () {
  var space = fromJS({ 
    connected: false
  });

  var peers = Map({});
  var self = Map({});
  return { space, peers, self };
}

function updatePeerIn(id, state) {
  return peers => peers.mergeIn([id], state);
}

function updatePeer(state) {
  return peer => peer.merge(state);
}

function applyMods(mods$, model) {
  return mods$.merge(Rx.Observable.just(model))
              .scan((acc, mod) => mod(acc))
              .shareReplay(1);
}

export default function Model(user, wamp, { space, peers, self }) {

  // self modifications
  var userStarted$ = wamp.opened$.map(s => updatePeer({ id: s.id, startedAt: Date.now()}));
  var click$ = user.click$.map(pos => updatePeer({ pos }));

  var selfMods$ = Rx.Observable.merge(userStarted$, click$);
  var self$ = applyMods(selfMods$, self);

  // peers modifications
  var peersUpdate$ = wamp.actions$.map(a => updatePeerIn(a.id, a.state));

  var peersMods$ = Rx.Observable.merge(peersUpdate$);
  var peers$ = applyMods(peersMods$, peers);

  // space modifications
  var spaceModConnected$ = wamp.opened$.map(() => s => s.merge({ connected: true }));
  var spaceModClosed$ = wamp.closed$.map(() => s => s.merge({ connected: false }));

  var spaceMods$ = Rx.Observable.merge(spaceModConnected$, spaceModClosed$);
  var space$ = applyMods(spaceMods$, space);

  return { self$, peers$, space$ };
}
