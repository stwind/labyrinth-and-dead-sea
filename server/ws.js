import dbg from 'debug';
import sio from 'socket.io';

var debug = dbg('app:ws');

export default function (server) {
  var io = sio(server);

  io.on('connection', socket => {
    debug('connected');

    socket.on('event', message => {
      debug('received: %s', message);
    });

    socket.emit('news', { hello: 'world' });
  });
}
