'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Posts = require('../models/Posts');

var _Posts2 = _interopRequireDefault(_Posts);

var _Categories = require('../models/Categories');

var _Categories2 = _interopRequireDefault(_Categories);

var _Counters = require('../models/Counters');

var _Counters2 = _interopRequireDefault(_Counters);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var router = _express2.default.Router();

/* AUTO_INCREMENT FOR POST ID */
function getNextSequence(name) {
  var count = _Counters2.default.findByIdAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { new: true }, function (err, count) {
    return count.seq;
  });
  console.log(count);
}

function getSearchReg(type, word) {
  if (type == 'tags') {
    return '^' + word + '$';
  } else {
    return '.*' + word + '.*';
  }
}
// GET ALL POST WITHOUT CATEGORY
router.get('/list/all', function (req, res) {
  _Posts2.default.find({}).sort({ _id: -1 }).exec(function (err, posts) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }

    res.json({ posts: posts });
  });
});

// GET PAGE POST WITHOUT CATEGORY
router.get('/list/all/:number', function (req, res) {
  var skip = (req.params.number - 1) * 10; // skip할 페이지
  var query = _Posts2.default.find({}).sort({ _id: -1 }).limit(10).skip(skip);
  query.exec(function (err, posts) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }

    res.json({ posts: posts });
  });
});

// GET ALL POST WITH CATEGORY
router.get('/list/:category', function (req, res) {
  _Posts2.default.find({ category: req.params.category }).sort({ _id: -1 }).exec(function (err, posts) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }

    res.json({ posts: posts });
  });
});

// GET PAGE POST
router.get('/list/:category/:number', function (req, res) {
  var re = ',' + req.params.category + ',';
  var subCategories = [];
  _Categories2.default.find({ path: { $regex: re } }, { name: 1 }).exec(function (err, categories) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    /* Get All SubCategories' posts */
    subCategories = categories.map(function (category) {
      return category.name;
    });
    subCategories.push(req.params.category);
    var skip = (req.params.number - 1) * 10; // skip할 페이지
    var query = _Posts2.default.find({ category: { $in: subCategories } }).sort({ _id: -1 }).limit(10).skip(skip);
    query.exec(function (err, posts) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'internal server error', code: 1 });
      }
      res.json({ posts: posts });
    });
  });
});

// GET ONE POST
router.get('/get/:postID', function (req, res) {
  /* update viewer */
  _Posts2.default.findOneAndUpdate({ _id: req.params.postID }, { $inc: { viewer: 1 } }, { new: true }, function (err, post) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    return res.json({ post: post });
  });
});

// GET PREV POST
router.get('/get/prev/:postID/:category', function (req, res) {
  var re = ',' + req.params.category + ',';
  var subCategories = [];
  _Categories2.default.find({ path: { $regex: re } }, { name: 1 }).exec(function (err, categories) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    /* Get All SubCategories' posts */
    subCategories = categories.map(function (category) {
      return category.name;
    });
    subCategories.push(req.params.category);
    _Posts2.default.findOne({ _id: { $lt: req.params.postID }, category: { $in: subCategories } }).sort({ _id: -1 }).limit(1).exec(function (err, prevPost) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'internal server error', code: 1 });
      }
      var post = {};
      if (prevPost) {
        post = {
          _id: prevPost._id,
          title: prevPost.title
        };
        res.json({ post: post });
      } else {
        res.json({ post: post });
      }
    });
  });
});

// GET NEXT POST
router.get('/get/next/:postID/:category', function (req, res) {
  var re = ',' + req.params.category + ',';
  var subCategories = [];
  _Categories2.default.find({ path: { $regex: re } }, { name: 1 }).exec(function (err, categories) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    /* Get All SubCategories' posts */
    subCategories = categories.map(function (category) {
      return category.name;
    });
    subCategories.push(req.params.category);
    _Posts2.default.findOne({ _id: { $gt: req.params.postID }, category: { $in: subCategories } }).sort({ _id: 1 }).limit(1).exec(function (err, nextPost) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'internal server error', code: 1 });
      }
      var post = {};
      if (nextPost) {
        post = {
          _id: nextPost._id,
          title: nextPost.title
        };
        res.json({ post: post });
      } else {
        res.json({ post: post });
      }
    });
  });
});

//GET SAME TAG POSTS
router.post('/get/related/tags', function (req, res) {
  _Posts2.default.find({ $and: [{ tags: { $in: req.body.tags } }, { _id: { $ne: req.body.postID } }] }, { title: 1, category: 1, author: 1, thumbnail: 1, tags: 1, viewer: 1 }).limit(3).exec(function (err, posts) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ posts: posts });
  });
});

//GET PAGE COUNT WITHOUT CATEGORY
router.get('/count/all', function (req, res) {
  _Posts2.default.find({}).count().exec(function (err, count) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ count: count });
  });
});

//GET PAGE COUNT
router.get('/count/:category', function (req, res) {
  var re = ',' + req.params.category + ',';
  var subCategories = [];
  _Categories2.default.find({ path: { $regex: re } }, { name: 1 }).exec(function (err, categories) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    /* Get All SubCategories' posts */
    subCategories = categories.map(function (category) {
      return category.name;
    });
    subCategories.push(req.params.category);
    _Posts2.default.find({ category: { $in: subCategories } }).count().exec(function (err, count) {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'internal server error', code: 1 });
      }
      res.json({ count: count });
    });
  });
});

// ADD POST
router.post('/add', function (req, res) {
  var post = req.body;
  var newPost = new _Posts2.default(post);
  newPost.save(function (err, post) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ post: post });
  });
});

// UPDATE POST
router.post('/update', function (req, res) {
  _Posts2.default.findOneAndUpdate({ _id: req.body._id }, { $set: { title: req.body.title, content: req.body.content, text: req.body.text, thumbnail: req.body.thumbnail, tags: req.body.tags } }, { new: true }, function (err, post) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ post: post });
  });
});

// DELETE POST
router.delete('/delete/:postID', function (req, res) {
  _Posts2.default.remove({ _id: req.params.postID }, function (err, post) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ post: post });
  });
});

// INCREASE RATING
router.post('/increase/rating', function (req, res) {
  _Posts2.default.findOneAndUpdate({ id: req.body.id }, { $inc: { rating: 1 } }, function (err, post) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ rating: post.rating });
  });
});

//INCREAE VIEWER
router.post('/increase/viewer', function (req, res) {
  _Posts2.default.findOneAndUpdate({ id: req.body.id }, { $inc: { viewer: 1 } }, function (err, post) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ post: post });
  });
});

//SEARCH COUNT ALL
router.get('/search/count/:word/:type', function (req, res) {
  var searchReg = getSearchReg(req.params.type, req.params.word);
  _Posts2.default.find(_defineProperty({}, req.params.type, { $regex: searchReg, $options: 'i' })).count().exec(function (err, count) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ count: count });
  });
});
//SEARCH COUNT IN CATEGORY
router.get('/search/count/:word/:type/:category', function (req, res) {
  var re = ',' + req.params.category + ',';
  var subCategories = [];
  _Categories2.default.find({ path: { $regex: re } }, { name: 1 }).exec(function (err, categories) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    /* Get All SubCategories' posts */
    subCategories = categories.map(function (category) {
      return category.name;
    });
    subCategories.push(req.params.category);

    var searchReg = getSearchReg(req.params.type, req.params.word);
    _Posts2.default.find(_defineProperty({ category: { $in: subCategories } }, req.params.type, { $regex: searchReg, $options: 'i' })).count().exec(function (err, count) {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'internal server error', code: 1 });
      }
      res.json({ count: count });
    });
  });
});

//SEARCH ALL POSTS
router.get('/search/:word/:type/:number', function (req, res) {
  var skip = (req.params.number - 1) * 10; // skip할 페이지
  var searchReg = getSearchReg(req.params.type, req.params.word);

  var query = _Posts2.default.find(_defineProperty({}, req.params.type, { $regex: searchReg, $options: 'i' })).sort({ _id: -1 }).limit(10).skip(skip);
  //search for title + contents
  if (req.params.type == 'all') {
    query = _Posts2.default.find({ $or: [{ title: { $regex: searchReg, $options: 'i' } }, { text: { $regex: searchReg, $options: 'i' } }] }).sort({ _id: -1 }).limit(10).skip(skip);
  }
  query.exec(function (err, results) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ results: results });
  });
});

//SEARCH IN CATEGORY
router.get('/search/:word/:type/:number/:category', function (req, res) {
  var re = ',' + req.params.category + ',';
  var subCategories = [];
  _Categories2.default.find({ path: { $regex: re } }, { name: 1 }).exec(function (err, categories) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    /* Get All SubCategories' posts */
    subCategories = categories.map(function (category) {
      return category.name;
    });
    subCategories.push(req.params.category);
    var skip = (req.params.number - 1) * 10; // skip할 페이지
    var searchReg = getSearchReg(req.params.type, req.params.word);

    var query = _Posts2.default.find(_defineProperty({ category: { $in: subCategories } }, req.params.type, { $regex: searchReg, $options: 'i' })).sort({ _id: -1 }).limit(10).skip(skip);
    //search for title + contents
    if (req.params.type == 'all') {
      query = _Posts2.default.find({ category: { $in: subCategories }, $or: [{ title: { $regex: searchReg, $options: 'i' } }, { text: { $regex: searchReg, $options: 'i' } }] }).sort({ _id: -1 }).limit(10).skip(skip);
    }
    query.exec(function (err, results) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'internal server error', code: 1 });
      }
      res.json({ results: results });
    });
  });
});

//SEARCH BY TYPE
router.post('/search/content', function (req, res) {
  //content는 html이므로 text로 검색.
  _Posts2.default.find({ text: req.body.word }, function (err, results) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ results: results });
  });
});

//COUNT SEARCH
router.post('/search/count', function (req, res) {
  _Posts2.default.find({ category: req.body.category, title: req.body.word }).count().exec(function (err, count) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ count: count });
  });
});

exports.default = router;