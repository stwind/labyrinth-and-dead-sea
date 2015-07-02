import dbg from 'debug';
import Cycle from 'cyclejs';
// import io from 'socket.io-client';

import Model from './model';
import View from './view';
// import Intent from './intent';
import InitialModel from './initial';

dbg.enable('app:*');

var debug = dbg('app:main');

var computer = function (interactions) {
    // const intent = Intent(interactions);
    const model = Model(InitialModel());
    const vtree$ = View(model);

    return { dom: vtree$ };
};

var domDriver = Cycle.makeDOMDriver('#main');
Cycle.run(computer, {
    dom: domDriver
});

// var socket = io.connect('ws://localhost:3000');

// socket.on('connect', () => {
//   debug('connected');
// });
