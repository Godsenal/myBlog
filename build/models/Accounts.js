'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var AccountSchema = new Schema({
  email: String,
  username: String,
  password: String,
  created: { type: Date, default: Date.now }
});
var collectionName = 'Accounts';
exports.default = _mongoose2.default.model('Account', AccountSchema, collectionName);