import dbg from 'debug';
import { Rx } from 'cyclejs';

var debug = dbg('app:model');

export default function Model(intent, wampIntent, initial) {
  var wampConnected$ = wampIntent.connected$.map(v => m => {
    return m.setIn(['status','connected'], true)
            .set('id', v.id);
  });
  var click$ = intent.click$.map(pos => m => {
    return m.mergeIn(['pos'], pos);
  });

  var mods$ = Rx.Observable.merge(click$, wampConnected$);

  function updateLastMod(model) {
    return model.set('lastmod', Date.now());
  }

  return {
    model$: mods$.merge(Rx.Observable.just(initial))
                 .scan((model, modFn) => modFn(model))
                 .map(updateLastMod)
                 .shareReplay(1)
  };
}
