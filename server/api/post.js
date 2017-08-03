import Posts from '../models/Posts';
import Categories from '../models/Categories';
import Counters from '../models/Counters';
import express from 'express';
const router = express.Router();

/* AUTO_INCREMENT FOR POST ID */
function getNextSequence(name) {
  var count = Counters.findByIdAndUpdate({ _id: name },{ $inc: { seq: 1 } },{new: true},function(err, count){
    return count.seq;
  });
  console.log(count);
}

// GET ALL POST WITHOUT CATEGORY
router.get('/list/all', function(req, res) {
  Posts.find({})
    .sort({_id:-1})
    .exec(function(err, posts) {
      if(err) {
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }

      res.json({posts});
    });
});

// GET PAGE POST WITHOUT CATEGORY
router.get('/list/all/:number', function(req, res) {
  var skip = (req.params.number - 1) * 10; // skip할 페이지
  var query = Posts.find({})
    .sort({_id:-1})
    .limit(10)
    .skip(skip);
  query.exec(function(err, posts) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }

    res.json({posts});
  });
});

// GET ALL POST WITH CATEGORY
router.get('/list/:category', function(req, res) {
  Posts.find({category: req.params.category})
    .sort({_id:-1})
    .exec(function(err, posts) {
      if(err) {
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }

      res.json({posts});
    });
});

// GET PAGE POST
router.get('/list/:category/:number', function(req, res) {
  var re = ','+req.params.category+',';
  var subCategories = [];
  Categories.find({path: {$regex:re}},{name: 1})
    .exec(function(err, categories){
      if(err){
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }
      /* Get All SubCategories' posts */
      subCategories = categories.map((category)=>{
        return category.name;
      });
      subCategories.push(req.params.category);
      var skip = (req.params.number - 1) * 10; // skip할 페이지
      var query = Posts.find({category: {$in: subCategories}})
        .sort({_id:-1})
        .limit(10)
        .skip(skip);
      query.exec(function(err, posts) {
        if(err) {
          console.log(err);
          return res.status(500).json({error: 'internal server error', code: 1});
        }
        res.json({posts});
      });
    });
});

// GET ONE POST
router.get('/get/:postID', function(req, res) {
  /* update viewer */
  Posts.findOneAndUpdate({_id: req.params.postID},{$inc:{viewer:1}}, {new: true}, function(err, post) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    return res.json({post});

  });
});

// GET PREV POST
router.get('/get/prev/:postID/:category', function(req, res) {
  var re = ','+req.params.category+',';
  var subCategories = [];
  Categories.find({path: {$regex:re}},{name: 1})
    .exec(function(err, categories){
      if(err){
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }
      /* Get All SubCategories' posts */
      subCategories = categories.map((category)=>{
        return category.name;
      });
      subCategories.push(req.params.category);
      Posts.findOne({_id: {$lt: req.params.postID},category: {$in: subCategories}})
        .sort({_id:-1})
        .limit(1)
        .exec(function(err, prevPost) {
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          let post = {};
          if(prevPost){
            post = {
              _id: prevPost._id,
              title: prevPost.title,
            };
            res.json({post});
          }
          else{
            res.json({post});
          }
        });
    });
});

// GET NEXT POST
router.get('/get/next/:postID/:category', function(req, res) {
  var re = ','+req.params.category+',';
  var subCategories = [];
  Categories.find({path: {$regex:re}},{name: 1})
    .exec(function(err, categories){
      if(err){
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }
      /* Get All SubCategories' posts */
      subCategories = categories.map((category)=>{
        return category.name;
      });
      subCategories.push(req.params.category);
      Posts.findOne({_id: {$gt: req.params.postID}, category: {$in: subCategories}})
        .sort({_id:1})
        .limit(1)
        .exec(function(err, nextPost) {
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          let post = {};
          if(nextPost){
            post = {
              _id: nextPost._id,
              title: nextPost.title,
            };
            res.json({post});
          }
          else{
            res.json({post});
          }
        });
    });
});

//GET SAME TAG POSTS
router.post('/get/related/tags',function(req,res){
  Posts.find({$and:[{tags:{ $in: req.body.tags }},{_id: { $ne: req.body.postID}}]},{title: 1, category: 1, author: 1, thumbnail: 1, tags: 1, viewer: 1})
    .limit(3)
    .exec(function(err, posts){
      if(err){
        console.log(err);
        return res.status(400).json({error: 'internal server error', code: 1});
      }
      res.json({posts});
    });
});

//GET PAGE COUNT WITHOUT CATEGORY
router.get('/count/all',function(req,res){
  Posts.find({})
    .count()
    .exec(function(err,count){
      if(err){
        console.log(err);
        return res.status(400).json({error: 'internal server error', code: 1});
      }
      res.json({count});
    });

});

//GET PAGE COUNT
router.get('/count/:category',function(req,res){
  var re = ','+req.params.category+',';
  var subCategories = [];
  Categories.find({path: {$regex:re}},{name: 1})
    .exec(function(err, categories){
      if(err){
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }
      /* Get All SubCategories' posts */
      subCategories = categories.map((category)=>{
        return category.name;
      });
      subCategories.push(req.params.category);
      Posts.find({category: {$in: subCategories}})
        .count()
        .exec(function(err,count){
          if(err){
            console.log(err);
            return res.status(400).json({error: 'internal server error', code: 1});
          }
          res.json({count});
        });
    });

});



// ADD POST
router.post('/add', function(req, res) {
  var post = req.body;
  var newPost = new Posts(post);
  newPost.save(function(err, post){
    if(err){
      console.log(err);
      return res.status(400).json({error: 'internal server error', code: 1});
    }
    res.json({post});
  });
});

// UPDATE POST
router.post('/update', function(req, res) {
  Posts.findOneAndUpdate({_id: req.body._id}, {$set:{title: req.body.title, content: req.body.content, text:req.body.text, thumbnail: req.body.thumbnail, tags: req.body.tags}},{new: true}, function(err, post){
    if(err){
      console.log(err);
      return res.status(400).json({error: 'internal server error', code: 1});
    }
    res.json({post});
  });
});

// DELETE POST
router.post('/delete', function(req,res){
  Posts.remove({_id:req.body._id},function(err, post){
    if(err){
      console.log(err);
      return res.status(400).json({error: 'internal server error', code: 1});
    }
    res.json({post});
  });
});

// INCREASE RATING
router.post('/increase/rating',function(req,res){
  Posts.findOneAndUpdate({id: req.body.id}, {$inc:{rating:1}},function(err, post){
    if(err){
      console.log(err);
      return res.status(400).json({error: 'internal server error', code: 1});
    }
    res.json({rating:post.rating});
  });
});

//INCREAE VIEWER
router.post('/increase/viewer',function(req,res){
  Posts.findOneAndUpdate({id: req.body.id}, {$inc:{viewer:1}},function(err, post){
    if(err){
      console.log(err);
      return res.status(400).json({error: 'internal server error', code: 1});
    }
    res.json({post});
  });
});



//SEARCH COUNT ALL
router.get('/search/count/:word/:type',function(req,res){
  var searchReg = '.*'+req.params.word +'.*';
  Posts.find({[req.params.type]: {$regex: searchReg, $options: 'i'}})
    .count()
    .exec(function(err,count){
      if(err){
        console.log(err);
        return res.status(400).json({error: 'internal server error', code: 1});
      }
      res.json({count});
    });
});
//SEARCH COUNT IN CATEGORY
router.get('/search/count/:word/:type/:category',function(req,res){
  var re = ','+req.params.category+',';
  var subCategories = [];
  Categories.find({path: {$regex:re}},{name: 1})
    .exec(function(err, categories){
      if(err){
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }
      /* Get All SubCategories' posts */
      subCategories = categories.map((category)=>{
        return category.name;
      });
      subCategories.push(req.params.category);

      var searchReg = '.*'+req.params.word +'.*';
      Posts.find({category: {$in: subCategories}, [req.params.type]: {$regex: searchReg, $options: 'i'}})
        .count()
        .exec(function(err,count){
          if(err){
            console.log(err);
            return res.status(400).json({error: 'internal server error', code: 1});
          }
          res.json({count});
        });
    });
});

//SEARCH ALL POSTS
router.get('/search/:word/:type/:number',function(req,res){
  var skip = (req.params.number - 1) * 10; // skip할 페이지
  var searchReg = '.*'+req.params.word +'.*';

  var query = Posts.find({[req.params.type]: {$regex: searchReg, $options: 'i'}})
    .sort({_id:-1})
    .limit(10)
    .skip(skip);
      //search for title + contents
  if(req.params.type == 'all'){
    query = Posts.find({$or:[{title: {$regex: searchReg, $options: 'i'}},{text: {$regex: searchReg, $options: 'i'}}]})
      .sort({_id:-1})
      .limit(10)
      .skip(skip);
  }
  query.exec(function(err, results) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({results});
  });
});

//SEARCH IN CATEGORY
router.get('/search/:word/:type/:number/:category',function(req,res){
  var re = ','+req.params.category+',';
  var subCategories = [];
  Categories.find({path: {$regex:re}},{name: 1})
    .exec(function(err, categories){
      if(err){
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }
      /* Get All SubCategories' posts */
      subCategories = categories.map((category)=>{
        return category.name;
      });
      subCategories.push(req.params.category);
      var skip = (req.params.number - 1) * 10; // skip할 페이지
      var searchReg = '.*'+req.params.word +'.*';

      var query = Posts.find({category: {$in: subCategories}, [req.params.type]: {$regex: searchReg, $options: 'i'}})
        .sort({_id:-1})
        .limit(10)
        .skip(skip);
        //search for title + contents
      if(req.params.type == 'all'){
        query = Posts.find({category: {$in: subCategories}, $or:[{title: {$regex: searchReg, $options: 'i'}},{text: {$regex: searchReg, $options: 'i'}}]})
          .sort({_id:-1})
          .limit(10)
          .skip(skip);
      }
      query.exec(function(err, results) {
        if(err) {
          console.log(err);
          return res.status(500).json({error: 'internal server error', code: 1});
        }
        res.json({results});
      });
    });
});

//SEARCH BY TYPE
router.post('/search/content',function(req,res){
  //content는 html이므로 text로 검색.
  Posts.find({text: req.body.word},function(err, results){
    if(err){
      console.log(err);
      return res.status(400).json({error: 'internal server error', code: 1});
    }
    res.json({results});
  });
});

//COUNT SEARCH
router.post('/search/count',function(req,res){
  Posts.find({category: req.body.category, title: req.body.word})
    .count()
    .exec(function(err, count){
      if(err){
        console.log(err);
        return res.status(400).json({error: 'internal server error', code: 1});
      }
      res.json({count});
    });
});



export default router;
