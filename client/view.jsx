import dbg from 'debug';
import { h } from 'cyclejs';

var debug = dbg('app:view');

function render(model0) {
  var model = model0.toJS(); 
  return <div>{String(model.pos.x)}</div>;
}

export default function View(model) {
  return model.model$.map(render);
};
