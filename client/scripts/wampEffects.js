import dbg from 'debug';
import { Rx } from 'cyclejs';

var debug = dbg('app:wamp:effects');

export default function WampEffects(user, model) {
  var click$ = user.click$
    .withLatestFrom(model.model$, (pos, m) => {
      return { 
        uri: 'snd.onaji.peer.move', 
        args: [m.get('id'), pos.toJS()] 
      };
    });

  return Rx.Observable.merge(click$).shareReplay(1);
}
