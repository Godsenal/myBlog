'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passport = require('passport');

var credentials = {
  key: _fs2.default.readFileSync(_config2.default.pathToKey, 'utf8'),
  cert: _fs2.default.readFileSync(_config2.default.pathToCert, 'utf8')
};

var db = _mongoose2.default.connection;
db.on('error', console.error);
db.once('open', function () {
  if (_config2.default.nodeEnv !== 'development') {
    console.log('Connected to mongod server');
  } else {
    console.log('Connected to mongolab server');
  }
});

_mongoose2.default.Promise = require('bluebird');
_mongoose2.default.connect(_config2.default.dbUrl);

var app = (0, _express2.default)();

var localSigninStrategy = require('./passport/local-signin');
passport.use('local-signin', localSigninStrategy);
/*
const localSignupStrategy = require('./passport/local-signup');
const facebookSigninStrategy = require('./passport/facebook-signin');
const otherSignupStrategy = require('./passport/other-signup');
passport.use('local-signup', localSignupStrategy);
passport.use('facebook-signin', facebookSigninStrategy);
passport.use('other-signup', otherSignupStrategy);
*/

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public'))); // 정적인 페이지 로드

app.use('/api', _api2.default);

app.get('*', function (req, res) {
  //req.params.contestId에 따라 다른 페이지를 만들어야함. route일 땐 undefined
  res.sendFile(_path2.default.resolve(__dirname, './../public/index.html'));
});

var httpServer = _http2.default.createServer(app);
var httpsServer = _https2.default.createServer(credentials, app);

httpServer.listen(_config2.default.port, _config2.default.host, function () {
  console.info('HTTP Express listening on port', _config2.default.port);
});

httpsServer.listen(_config2.default.portHttps, _config2.default.host, function () {
  console.info('HTTPS Express listening on port', _config2.default.portHttps);
});