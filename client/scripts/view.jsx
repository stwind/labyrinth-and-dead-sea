import dbg from 'debug';
import { h } from 'cyclejs';

var debug = dbg('app:view');

function render(model) {
  return (
    <div className="main">
      <div>{String(model.getIn(['pos','x']))},{String(model.getIn(['pos','y']))}</div>
      <div>{String(model.get('id'))}</div>
      <ul>
        {model.get('moves').map(renderMove).toArray()}
      </ul>
    </div>
  );
}

function renderMove (move) {
  var key = move.id + ':' + move.offset;
  return (
    <li key={key}>{move.id + ':' + move.pos.x + ',' + move.pos.y}</li>
  );
}

export default function View(model) {
  return model.model$.map(render);
};
