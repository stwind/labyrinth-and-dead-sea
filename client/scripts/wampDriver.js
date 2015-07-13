import dbg from 'debug';
import { Rx } from '@cycle/core';
import autobahn from 'autobahn';

var debug = dbg('app:wamp:driver');

function createWampDriver (url, realm) {
  var events = {
    opened$: new Rx.Subject(),
    closed$: new Rx.Subject(),
    started$: new Rx.Subject(),
    actions$: new Rx.Subject()
  };

  function onOpen (session, events$) {
    events$.forEach(event => session.call(event.uri, event.args));

    events.opened$.onNext({ id: session.id });

    subscribeMoves(session).then(() => start(session));
  }
  
  function subscribeMoves (session) {
    return session.subscribe(`snd.onaji.moves.${session.id}`, args => {
      events.actions$.onNext(args[0]);
    });
  }

  function start (session) {
    session.call('snd.onaji.peer.enter', [session.id])
      .then(() => events.started$.onNext(true));
  }

  function onClose() {
    events.closed$.onNext(true);
  }

  return function (events$) {
    var socket = new autobahn.Connection({ url: url, realm: realm });

    socket.onopen = session => onOpen(session, events$);
    socket.onclose = onClose;

    socket.open();

    return {
      get: name => events[name + '$'],
      dispose: socket.close.bind(socket)
    };
  };
}

export default { createWampDriver };
