import dbg from 'debug';
import nconf from 'nconf';
import nightlife from 'nightlife-rabbit';
import autobahn from 'autobahn';

import onaji from './onaji';

var debug = dbg('app:wamp');

function setupService (session, onaji) {
  session.register('snd.onaji.peer.move', args => onaji.peerMove.apply(onaji, args));

  session.register('snd.onaji.peer.enter', args => {
    var id = args[0];
    var uri = `snd.onaji.moves.${id}`;

    var peer = onaji.peerEnter(id);
    peer.stream.subscribe(
      x => session.publish(uri, [x]),
      err => debug('err', err),
      () => debug('move streams end', uri)
    );
  });
}

export default function (server, onaji) {
  var router = nightlife.createRouter({
    httpServer: server, path: '/wamp',
    autoCreateRealms: false
  });

  var realm = 'snd.onaji';
  var url = `ws://${nconf.get('listen')}:${nconf.get('port')}/wamp`;

  router.createRealm(realm);

  var socket = new autobahn.Connection({ url: url, realm: realm });

  socket.onopen = session => setupService(session, onaji);

  socket.open();
}
