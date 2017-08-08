'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var CommentSchema = new Schema({
  author: String,
  parent: { type: String, default: null },
  content: String,
  rating: { type: Number, default: 0 },
  created: { type: Date, default: Date.now }
});
var collectionName = 'Comments';
exports.default = _mongoose2.default.model('Comment', CommentSchema, collectionName);