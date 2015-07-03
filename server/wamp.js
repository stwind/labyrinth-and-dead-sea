import dbg from 'debug';
import nconf from 'nconf';
import nightlife from 'nightlife-rabbit';
import autobahn from 'autobahn';

import onaji from './onaji';

var debug = dbg('app:wamp');

var services = {
  'snd.onaji.peer.enter': 'peerEnter',
  'snd.onaji.peer.move': 'peerMove'
};

export default function (server, onaji) {
  var router = nightlife.createRouter({
    httpServer: server, path: '/wamp',
    autoCreateRealms: false
  });

  var realm = 'snd.onaji';

  router.createRealm(realm);

  var url = `ws://${nconf.get('listen')}:${nconf.get('port')}/wamp`;

  var socket = new autobahn.Connection({ url: url, realm: realm });

  socket.onopen = session => {
    Object.keys(services).forEach(uri => {
      session.register(uri, args => onaji[services[uri]].apply(onaji, args));
    })
  };

  socket.open();
}
