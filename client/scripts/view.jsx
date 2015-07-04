import dbg from 'debug';
import { h } from 'cyclejs';

var debug = dbg('app:view');

function render({ self, peers, space }) {
  return (
    <div className="main">
      <div>{`${self.get('id')}: ${self.getIn(['pos','x'])},${self.getIn(['pos','y'])}`}</div>
      <ul>
        {peers.map(renderPeer).toArray()}
      </ul>
    </div>
  );
}

function renderPeer (peer, id) {
  return (
    <li key={id}>{`${id}: ${peer.getIn(['pos','x'])},${peer.getIn(['pos','y'])}`}</li>
  );
}

export default function View({ space$, peers$, self$ }) {
  return space$.combineLatest(peers$, self$, (space, peers, self) => { 
    return { space, peers, self };
  }).map(render);
};
