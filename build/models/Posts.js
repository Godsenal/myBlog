'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Counters = require('./Counters');

var _Counters2 = _interopRequireDefault(_Counters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var PostSchema = new Schema({
  _id: String,
  author: String,
  title: String,
  thumbnail: { type: String, default: '' },
  content: String, // html
  text: String, // only TEXT
  category: String,
  comments: { type: Array, default: [] },
  tags: { type: Array, default: [] },
  rating: { type: Number, default: 0 },
  viewer: { type: Number, default: 0 },
  created: { type: Date, default: Date.now }
});

PostSchema.pre('save', function (next) {
  var post = this;
  _Counters2.default.findByIdAndUpdate({ _id: 'postID' }, { $inc: { seq: 1 } }, { new: true }, function (err, count) {
    post._id = count.seq;
    next();
  });
});

var collectionName = 'Posts';
exports.default = _mongoose2.default.model('Post', PostSchema, collectionName);