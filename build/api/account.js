'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Accounts = require('../models/Accounts');

var _Accounts2 = _interopRequireDefault(_Accounts);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
/*
router.post('/signup',function(){
  var account = new Accounts({
    email: 'tmqps78@naver.com',
    username: 'godsenal',
  });
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync('lee3737', salt);
  account.password = hash;

  account.save();
});
*/
router.post('/signin', function (req, res, next) {
  if (typeof req.body.password !== 'string') {
    return res.status(401).json({
      error: 'SIGNIN FAILED',
      code: 1
    });
  }

  _passport2.default.authenticate('local-signin', function (err, token, data) {
    if (err) {
      return res.status(401).json({
        error: 'SIGNIN FAILED',
        code: 2
      });
    }
    if (!data) {
      return res.status(401).json({
        error: 'CAN NOT FIND USER',
        code: 3
      });
    }
    //user has authenticated correctly thus we create a JWT token
    return res.json({
      token: token,
      email: data.email,
      username: data.username
    });
  })(req, res, next);

  /*
      GET CURRENT USER INFO GET /api/account/getInfo
  */
});

router.get('/getinfo', function (req, res) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      error: 'INVALID STATUS',
      code: 1
    });
  }

  var token = req.headers.authorization.split(' ')[1];
  _jsonwebtoken2.default.verify(token, _config2.default.jwtSecret, function (err, decoded) {

    if (err) {
      return res.status(401).json({
        error: 'CANNOT DECODED TOKEN',
        code: 2
      });
    }

    _Accounts2.default.findOne({ email: decoded.email }, { id: 1 }, function (err, user) {
      if (err) {
        return res.status(401).json({
          error: 'MONGO ERROR',
          code: 2
        });
      }

      return res.json({ info: user });
    });
  });
});

/*
    LOGOUT: POST /api/account/logout     ///지워도됨 JWT에서는 필요가 없다.
*/
router.post('/signout', function (req, res) {
  req.session.destroy();
  return res.json({ success: true });
});

exports.default = router;