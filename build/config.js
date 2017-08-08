'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var env = process.env;
var localDB = 'mongodb://localhost:27017/blogDB';
var nodeEnv = exports.nodeEnv = env.NODE_ENV || 'development';

exports.default = {
  port: env.PORT || 8080,
  portHttps: 8443,
  host: env.HOST || '192.168.0.8',
  domain: env.DOMAIN || 'localhost',
  get serverUrl() {
    return 'https://' + this.host + ':' + this.port;
  },
  nodeEnv: nodeEnv,
  //dbUrl : 'mongodb://localhost:27017/chatDB',
  dbUrl: localDB,
  jwtSecret: 'Godsenal!3737',
  pathToCert: nodeEnv != 'development' ? __dirname + '/ssl/lth.com.crt' : __dirname + '/ssl/server.crt',
  pathToKey: nodeEnv != 'development' ? __dirname + '/ssl/lth.com.key' : __dirname + '/ssl/server.key'
  //sessionSecret: 'Godsenal!3737',
};