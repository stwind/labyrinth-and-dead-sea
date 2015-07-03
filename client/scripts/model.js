import dbg from 'debug';
import { Rx } from 'cyclejs';
import { fromJS, Map } from 'immutable';

var debug = dbg('app:model');

export function initial () {
  var model = { 
    id: 0,
    pos: { x: 0, y: 0 }, 

    connected: false,
    started: false,

    startedAt: null,
    createdAt: Date.now(),
    lastMod: Date.now()
  };
  return fromJS(model);
}

export default function Model(user, wamp, initial) {
  var wampConnected$ = wamp.connected$
    .tap(session => debug('wamp connected', session))
    .map(session => m => {
      return m.merge({ connected: true, id: session.id });
    });

  var wampRoomEntered$ = wamp.roomEntered$
    .tap(() => debug('room entered'))
    .map(() => m => {
      return m.merge({ started: true, startedAt: Date.now() });
    });

  var click$ = user.click$.map(pos => m => m.mergeIn(['pos'], pos));

  var mods$ = Rx.Observable.merge(click$, wampConnected$, wampRoomEntered$);

  return {
    model$: mods$.merge(Rx.Observable.just(initial))
                 .scan((model, modFn) => modFn(model))
                 .map(m => m.set('lastMod', Date.now()))
                 .shareReplay(1)
  };
}
