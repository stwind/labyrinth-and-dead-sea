import dbg from 'debug';
import { Rx } from 'cyclejs';

var debug = dbg('app:wamp:effects');

export default function WampEffects(intent, model) {
  var click$ = intent.click$
                     .withLatestFrom(model.model$, (pos, m) => ({ 
                       id: m.get('id'), pos: pos
                     }))
                     .map(v => {
                       return {
                         uri: 'snd.onaji.pos.add',
                         args: [v.id, v.pos.toJS()]
                       };
                     });

  return Rx.Observable.merge(click$).shareReplay(1);
}
