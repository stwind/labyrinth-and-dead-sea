import { Rx } from 'cyclejs';
import { Map } from 'immutable';

export default function Intent({ dom }) {
  return {
    click$: dom.get('.main', 'click')
               .map(ev => Map({ x: ev.clientX, y: ev.clientY }))
               .shareReplay(1)
  }
}
