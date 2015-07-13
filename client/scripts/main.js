import dbg from 'debug';
import Cycle from '@cycle/core';
import { makeDOMDriver } from '@cycle/web';

import Model from './model';
import { initial as initialModel } from './model';
import View from './view';
import Intent from './intent';
import { createWampDriver } from './wampDriver';
import WampIntent from './wampIntent';
import WampEffects from './wampEffects';
import Sekai from './components/sekai';

require('normalize.css/normalize.css');
require('styles/app.css');

dbg.enable('app:*');

var debug = dbg('app:main');

var computer = function (interactions) {
  const userIntent = Intent(interactions);
  // const wampIntent = WampIntent(interactions);
  const model = Model(userIntent, initialModel());
  // const wampEffects$ = WampEffects(userIntent, wampIntent, model);
  const vtree$ = View(model);

  return { dom: vtree$ };
};

Cycle.run(computer, {
  dom: makeDOMDriver('#app', {
    'sekai': Sekai
  })
  // wamp: createWampDriver('ws://localhost:3000/wamp', 'snd.onaji')
});
