import { Rx } from 'cyclejs';
import { Map } from 'immutable';

export default function wampIntent({ wamp }) {
  return {
    connected$: wamp.get('connected').shareReplay(1),
    roomEntered$: wamp.get('roomEntered').shareReplay(1)
  }
}
