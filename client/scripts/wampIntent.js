import { Rx } from 'cyclejs';

export default function wampIntent({ wamp }) {
  return {
    opened$: wamp.get('opened').shareReplay(1),
    closed$: wamp.get('closed').shareReplay(1),
    roomEntered$: wamp.get('roomEntered').shareReplay(1)
  }
}
