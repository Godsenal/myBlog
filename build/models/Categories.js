'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var CategorySchema = new Schema({
  name: { type: String, unique: true },
  path: { type: String, default: null }
});

var collectionName = 'Categories';
exports.default = _mongoose2.default.model('Category', CategorySchema, collectionName);