import { Rx } from 'cyclejs';

export default function Model(initial) {
  return {
    model$: initial.model$
  };
}
