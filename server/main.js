process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');
const debug = require('debug')('app:server');
const nconf = require('nconf');
const http = require('http');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const server = express();
const httpServer = http.createServer(server);

var env = server.get('env');

nconf.file(path.join(__dirname, './config/' + env + '.json'));

server.use(compression())
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// server.use('/api', expressJwt({ secret: nconf.get('auth:secret') }));
// server.use('/api', require('./routes/api'));

if ('development' == env) {
}

// server.use(express.static('public'));

httpServer.listen(nconf.get('port'), nconf.get('listen'), function () {
  console.log('Express server listening on %d, in %s mode', nconf.get('port'), env);
});
