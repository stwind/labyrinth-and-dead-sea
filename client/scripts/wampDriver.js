import dbg from 'debug';
import { Rx } from 'cyclejs';
import autobahn from 'autobahn';

var debug = dbg('app:wamp:driver');

function createWampDriver (url, realm) {
  var events = {
    opened$: new Rx.Subject(),
    closed$: new Rx.Subject(),
    roomEntered$: new Rx.Subject(),
    moves$: new Rx.Subject()
  };

  function onOpen (session, events$) {
    events$.forEach(event => session.call(event.uri, event.args));

    events.opened$.onNext({ id: session.id });

    subscribeMoves(session).then(() => enterRoom(session));
  }
  
  function subscribeMoves (session) {
    return session.subscribe(`snd.onaji.moves.${session.id}`, args => {
      debug('shit', args[0]);
    });
  }

  function enterRoom (session) {
    session.call('snd.onaji.peer.enter', [session.id])
      .then(() => events.roomEntered$.onNext(true));
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
