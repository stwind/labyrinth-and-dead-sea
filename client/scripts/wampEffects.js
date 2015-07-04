import dbg from 'debug';
import { Rx } from 'cyclejs';

var debug = dbg('app:wamp:effects');

export default function WampEffects(user, wamp, { self$ }) {
  var selfMods$ = self$
    .skipUntil(wamp.opened$)
    .map(peer => {
      return { 
        uri: 'snd.onaji.peer.move', 
        args: [peer.get('id'), peer.toJS(), Date.now() - peer.get('startedAt')] 
      };
    });

  return Rx.Observable.merge(selfMods$).shareReplay(1);
}
