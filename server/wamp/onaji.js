import dbg from 'debug';
import autobahn from 'autobahn';

var debug = dbg('app:wamp:onaji');

export default function(url, realm) {
  var onaji = new autobahn.Connection({ url: url, realm: realm });

  onaji.onopen = function (session) {
    session.register('snd.onaji.pos.add', function (args, kwargs, details) {
      return true;
    });
  };

  onaji.open();
}
