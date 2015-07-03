import dbg from 'debug';
import { Rx } from 'cyclejs';
import autobahn from 'autobahn';

var debug = dbg('app:wamp:driver');

function createWampDriver(url, realm) {
  var socket = new autobahn.Connection({ url: url, realm: realm });

  var events = {
    connected$: new Rx.Subject(),
    roomEntered$: new Rx.Subject()
  };

  function get(eventName) {
    return events[eventName + '$'];
  }

  function connected(session, events$) {
    events$.forEach(event => session.call(event.uri, event.args));

    session.call('snd.onaji.peer.enter', [session.id])
           .then(() => events.roomEntered$.onNext(true));

    events.connected$.onNext({ id: session.id });
  }

  return function (events$) {
    socket.onopen = session => connected(session, events$);

    socket.open();

    return {
      get: get,
      dispose: socket.close.bind(socket)
    };
  };
}

export default { createWampDriver };
