import dbg from 'debug';
import { h } from 'cyclejs';

var debug = dbg('app:view');

function render(model) {
  return <div>{String(model.getIn(['pos','x']))},{String(model.getIn(['pos','y']))}</div>;
}

export default function View(model) {
  return model.model$.map(render);
};
