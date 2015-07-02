import { Rx } from 'cyclejs';
import { fromJS } from 'immutable';

export default function ModelSource() {
  var model = { pos: { x: 100, y: 100 } };
  return fromJS(model);
};
