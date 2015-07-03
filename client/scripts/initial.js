import { Rx } from 'cyclejs';
import { fromJS } from 'immutable';

export default function ModelSource() {
  var model = { 
    pos: { x: 0, y: 0 }, 
    status: {
      connected: false
    },
    id: 0
  };
  return fromJS(model);
};
