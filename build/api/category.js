'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Categories = require('../models/Categories');

var _Categories2 = _interopRequireDefault(_Categories);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

//GET ALL CATEGORY
router.get('/list', function (req, res) {

  _Categories2.default.find({}, function (err, categories) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }

    res.json({ categories: categories });
  });
});

//NEW CATEGORY
router.post('/add', function (req, res) {
  var category = {
    name: req.body.name
  };
  if ('path' in req.body) {
    category.path = req.body.path;
  }

  _Categories2.default.find({ name: category.name }, function (err, categories) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    if (categories.length) {
      return res.status(500).json({ error: 'Exist Name', code: 2 });
    } else {
      var newCategory = new _Categories2.default(category);
      newCategory.save(function (err, category) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'internal server error', code: 1 });
        }

        res.json({ category: category });
      });
    }
  });
});

//RENAME CATEGORY
router.put('/update', function (req, res) {
  var id = req.body.categoryID;
  var update = req.body.update;
  _Categories2.default.findByIdAndUpdate(id, update, { new: true }, function (err, category) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ category: category });
  });
});

//DELETE CATEGORY
router.delete('/delete/:categoryID/:categoryName', function (req, res) {
  var re = ',' + req.params.categoryName + ',';
  _Categories2.default.remove({ $or: [{ _id: req.params.categoryID }, { path: { $regex: re } }] }, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ categoryID: req.params.categoryID });
  });
});

//GET CATEGORY
router.get('/get/:categoryName', function (req, res) {
  _Categories2.default.findOne({ name: req.params.categoryName }, function (err, category) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    if (!category) {
      res.json({});
    } else {
      res.json({ category: category });
    }
  });
});

exports.default = router;