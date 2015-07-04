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

export default function Model(user, wamp, { space, peers, self }) {

  // self modifications
  var userStarted$ = wamp.opened$.map(s => updatePeer({ id: s.id, startedAt: Date.now()}));
  var click$ = user.click$.map(pos => updatePeer({ pos }));

  var selfMods$ = Rx.Observable.merge(userStarted$, click$);

  var self$ = selfMods$
    .merge(Rx.Observable.just(self))
    .scan((self, mod) => mod(self))
    .shareReplay(1);

  // peers modifications
  var peersUpdate$ = wamp.actions$.map(a => updatePeerIn(a.id, a.state));

  var peersMods$ = Rx.Observable.merge(peersUpdate$);

  var peers$ = peersMods$
    .merge(Rx.Observable.just(peers))
    .scan((peers, mod) => mod(peers))
    .shareReplay(1);

  // space modifications
  var spaceModConnected$ = wamp.opened$.map(() => s => s.merge({ connected: true }));
  var spaceModClosed$ = wamp.closed$.map(() => s => s.merge({ connected: false }));

  var spaceMods$ = Rx.Observable.merge(
    spaceModConnected$, spaceModClosed$
  );

  var space$ = spaceMods$
    .merge(Rx.Observable.just(space))
    .scan((space, mod) => mod(space))
    .shareReplay(1);

  return { self$, peers$, space$ };
}
