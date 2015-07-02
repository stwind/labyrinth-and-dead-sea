import { Rx } from 'cyclejs';

export default function Model(intent, initial) {
  var move$ = intent.move$.map(pos => m => m.mergeIn(['pos'], pos));

  var mods$ = Rx.Observable.merge(move$);

  return {
    model$: mods$.merge(Rx.Observable.just(initial))
                 .scan((model, modFn) => modFn(model))
                 .shareReplay(1)
  };
}
