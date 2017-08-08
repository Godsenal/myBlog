'use strict';

var _Accounts = require('../models/Accounts');

var _Accounts2 = _interopRequireDefault(_Accounts);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = require('jsonwebtoken');

var PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, function (req, email, password, done) {
  var userData = {
    email: email.trim(),
    password: password.trim()
  };
  // find a user by email address
  _Accounts2.default.findOne({ email: userData.email }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      var error = {};
      error.name = 'IncorrectCredentialsError';
      error.code = 2;

      return done(error);
    }

    /*/ check if a hashed user's password is equal to a value saved in the database
    if(userData.password !== user.password) {
      let error = {};
      error.name = 'IncorrectCredentialsError';
      error.code = 3;
      return done(error);
    }*/

    if (!_bcryptjs2.default.compareSync(password, user.password)) {
      var _error = {};
      _error.name = 'IncorrectCredentialsError';
      _error.code = 3;

      return done(_error);
    }
    var payload = {
      email: user.email,
      isSignedIn: true
    };
    // create a token string
    var token = jwt.sign(payload, _config2.default.jwtSecret);
    var data = {
      email: user.email,
      username: user.username
    };
    return done(null, token, data);
  });
});