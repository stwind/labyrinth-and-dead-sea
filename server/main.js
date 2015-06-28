process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import path from 'path';
import dbg from 'debug';
import nconf from 'nconf';
import http from 'http';
import express from 'express';
import compression from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import api from './routes/api';
import ws from './ws';

var debug = dbg('app:server');
var server = express();
var httpServer = http.createServer(server);
var env = server.get('env');

nconf.file(path.join(__dirname, './config/' + env + '.json'));

server.use(compression())
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/api', api);
ws(httpServer);

if ('development' == env) {
}

// server.use(express.static('public'));

httpServer.listen(nconf.get('port'), nconf.get('listen'), function () {
  console.log('Express server listening on %d, in %s mode', nconf.get('port'), env);
});
