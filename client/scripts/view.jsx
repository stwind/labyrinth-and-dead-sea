import dbg from 'debug';
import { h } from '@cycle/web';

var debug = dbg('app:view');

function render({ self, peers, space }) {
  return (
    <div className="main">
      <sekai key="sekai"/>
    </div>
  );
}

export default function View({ space$, peers$, self$ }) {
  return space$.combineLatest(peers$, self$, (space, peers, self) => { 
    return { space, peers, self };
  }).map(render);
};
