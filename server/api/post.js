import Posts from '../models/Posts';
import express from 'express';
const router = express.Router();


// GET ALL POST
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
  var skip = (req.params.number - 1) * 10; // skip할 페이지
  var query = Posts.find({category: req.params.category})
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

// GET ONE POST
router.get('/get/:postID', function(req, res) {
  /* update viewer */
  Posts.findOneAndUpdate({_id: req.params.postID},{$inc:{viewer:1}}, {new: true}, function(err, post) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({post});
  });
});

// GET PREV POST
router.get('/get/prev/:postID', function(req, res) {
  Posts.findOne({_id: {$lt: req.params.postID}})
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

// GET NEXT POST
router.get('/get/next/:postID', function(req, res) {
  Posts.findOne({_id: {$gt: req.params.postID}})
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


//GET PAGE COUNT
router.get('/count/:category',function(req,res){
  Posts.find({category:req.params.category})
    .count()
    .exec(function(err,count){
      if(err){
        console.log(err);
        return res.status(400).json({error: 'internal server error', code: 1});
      }
      res.json({count});
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
  Posts.findOneAndUpdate({id: req.body.id}, {$set:{title: req.body.title, content: req.body.content, created: req.body.created}},{new: true}, function(err, post){
    if(err){
      console.log(err);
      return res.status(400).json({error: 'internal server error', code: 1});
    }
    res.json({post});
  });
});

// DELETE POST
router.post('/delete', function(req,res){
  Posts.remove({id:req.body.id},function(err, post){
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



export default router;
