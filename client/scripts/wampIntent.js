import dbg from 'debug';
import { Rx } from 'cyclejs';

var debug = dbg('app:wamp:intent');

export default function wampIntent({ wamp }) {
  return {
    opened$: wamp.get('opened').tap(s => debug(`wamp opened: ${s.id}`)).shareReplay(1),
    closed$: wamp.get('closed').tap(() => debug('wamp closed')).shareReplay(1),
    started$: wamp.get('started').tap(() => debug('wamp started')).shareReplay(1),
    actions$: wamp.get('actions').tap(x => debug('action', x)).shareReplay(1)
  }
}
