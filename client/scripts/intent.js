import dbg from 'debug';
import { Rx } from '@cycle/core';

var debug = dbg('app:intent');

export default function Intent({ dom }) {
  return {
    click$: dom.get('.main', 'click')
               .map(ev => ({ x: ev.clientX, y: ev.clientY }))
               .tap(pos => debug(`user clicked: ${pos.x},${pos.y}`))
               .shareReplay(1)
  }
}
