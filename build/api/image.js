'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var multer = require('multer');

var thumbnailStorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './public/assets/posts/thumbnails/');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

var imageStorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './public/assets/posts/images/');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

var uploadThumbnail = multer({ storage: thumbnailStorage }).single('file');
var uploadImage = multer({ storage: imageStorage }).array('file', 20);

//Save Thumbnail Image
router.post('/thumbnail', function (req, res) {
  uploadThumbnail(req, res, function (err) {
    if (err) {
      return res.json({ error: 'Error occured during updating image' });
    }
    return res.json({ filename: req.file.filename });
  });
});

//Save Thumbnail Image
router.post('/images', function (req, res) {
  uploadImage(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.json({ error: 'Error occured during updating image' });
    }
    var filenames = [];
    for (var i = 0; i < req.files.length; i++) {
      filenames.push(req.files[i].filename);
    }
    return res.json({ filenames: filenames });
  });
});

exports.default = router;