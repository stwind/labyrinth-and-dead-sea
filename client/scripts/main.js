import dbg from 'debug';
import Cycle from 'cyclejs';

import Model from './model';
import View from './view';
import Intent from './intent';
// import Wamp from './wampDriver';
// import WampIntent from './wampIntent';
import InitialModel from './initial';

require('normalize.css/normalize.css');
require('styles/app.css');

dbg.enable('app:*');

var debug = dbg('app:main');

var computer = function (interactions) {
  const intent = Intent(interactions);
  // const wampIntent = WampIntent(interactions);
  const model = Model(intent, InitialModel());
  const vtree$ = View(model);

  return { dom: vtree$ };
};

Cycle.run(computer, {
  dom: Cycle.makeDOMDriver('#main')
  // wamp: Wamp.createWampDriver('ws://localhost:3000/wamp', 'snd.onaji')
});
