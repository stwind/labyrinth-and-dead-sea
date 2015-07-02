import { Rx } from 'cyclejs';
import { Map } from 'immutable';

export default function Intent({ dom }) {
  return {
    move$: Rx.Observable.fromEvent(document.body, 'mousemove')
             .map(ev => Map(({ x: ev.clientX, y: ev.clientY })))
             .shareReplay(1)
  }
}
