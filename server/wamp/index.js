import dbg from 'debug';
import nconf from 'nconf';
import nightlife from 'nightlife-rabbit';

import onaji from './onaji';

var debug = dbg('app:wamp');

export default function (server) {
  var router = nightlife.createRouter({
    httpServer: server,
    path: '/wamp',
    autoCreateRealms: false
  });

  var realm = 'snd.onaji';

  router.createRealm(realm);

  var url = `ws://${nconf.get('listen')}:${nconf.get('port')}/wamp`;

  onaji(url, realm);
}
