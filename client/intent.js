import { Rx } from 'cyclejs';
import { Map } from 'immutable';

export default function Intent({ dom }) {
  return {
    move$: dom.get('body', 'mousemove')
              .map(ev => Map(({ x: ev.screenX, y: ev.screenY })))
              .shareReplay(1)
  }
}
