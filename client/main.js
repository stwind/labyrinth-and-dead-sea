import dbg from 'debug';
import io from 'socket.io-client';

dbg.enable('app:*');

var debug = dbg('app:main');

var socket = io('ws://localhost:3000');

socket.on('connect', () => {
  debug('connected');
});
