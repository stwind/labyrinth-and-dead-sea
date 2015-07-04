import dbg from 'debug';
import { Rx } from 'cyclejs';

var debug = dbg('app:wamp:effects');

export default function WampEffects(user, wamp, model) {
  var click$ = user.click$
    .skipUntil(wamp.roomEntered$)
    .withLatestFrom(model.model$, (pos, m) => {
      return { 
        uri: 'snd.onaji.peer.move', 
        args: [m.get('id'), pos.toJS(), Date.now() - m.get('startedAt')] 
      };
    });

  return Rx.Observable.merge(click$).shareReplay(1);
}
