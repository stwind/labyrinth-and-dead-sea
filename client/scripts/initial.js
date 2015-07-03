import { Rx } from 'cyclejs';
import { fromJS } from 'immutable';

export default function ModelSource() {
  var model = { 
    id: 0,
    pos: { x: 0, y: 0 }, 
    status: {
      connected: false
    },
    lastmod: Date.now()
  };
  return fromJS(model);
};
