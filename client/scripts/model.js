import dbg from 'debug';
import { Rx } from 'cyclejs';
import { fromJS, Map } from 'immutable';

var debug = dbg('app:model');

export function initial () {
  var model = { 
    id: 0,
    pos: { x: 0, y: 0 }, 

    moves: [],

    connected: false,
    started: false,

    startedAt: null,
    createdAt: Date.now(),
    lastMod: Date.now()
  };
  return fromJS(model);
}

export default function Model(user, wamp, initial) {
  var wampOpened$ = wamp.opened$
    .tap(session => debug(`wamp opened: ${session.id}`))
    .map(session => m => {
      return m.merge({ connected: true, id: session.id });
    });

  var wampClosed$ = wamp.closed$
    .tap(() => debug('wamp closed'))
    .map(() => m => m.merge({ connected: false }));

  var wampRoomEntered$ = wamp.roomEntered$
    .tap(() => debug('room entered'))
    .map(() => m => {
      return m.merge({ started: true, startedAt: Date.now() });
    });

  var wampMoves$ = wamp.moves$
    .tap(x => debug('move', x))
    .map(x => m => {
      return m.updateIn(['moves'], moves => moves.push(x));
    });

  var click$ = user.click$.map(pos => m => m.mergeIn(['pos'], pos));

  var mods$ = Rx.Observable.merge(
    click$, wampOpened$, wampClosed$, wampRoomEntered$, wampMoves$);

  return {
    model$: mods$.merge(Rx.Observable.just(initial))
                 .scan((model, modFn) => modFn(model))
                 .map(m => m.set('lastMod', Date.now()))
                 .shareReplay(1)
  };
}
