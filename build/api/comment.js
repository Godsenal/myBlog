'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Comments = require('../models/Comments');

var _Comments2 = _interopRequireDefault(_Comments);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

//GET ALL Comments with postID
router.get('/list/:postID', function (req, res) {

  _Comments2.default.find({ postID: req.params.postID }, function (err, comments) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }

    res.json({ comments: comments });
  });
});

//NEW COMMENT
router.post('/add', function (req, res) {

  var comment = {
    author: req.body.author,
    postID: req.body.postID,
    content: req.body.content,
    parent: req.body.parent
  };

  var newComment = new _Comments2.default(comment);
  newComment.save(function (err, comment) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }

    res.json({ comment: comment });
  });
});

//EDIT COMMENT
router.post('/update', function (req, res) {
  var id = req.body.id;
  var content = req.body.content;

  _Comments2.default.findOneAndUpdate({ id: id }, { $set: { content: content } }, { new: true }, function (err, comment) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ comment: comment });
  });
});

//DELETE CATEGORY
router.post('/delete', function (req, res) {
  var id = req.body.id;
  var parent = req.body.parent;

  if (!parent) {
    return res.json({ error: 'Cannot Delete Root Comment' });
  }

  _Comments2.default.remove({ id: id }, function (err, comment) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ comment: comment });
  });
});

exports.default = router;