import Posts from '../models/Posts';
import express from 'express';
const router = express.Router();


// GET ALL POST
router.get('/list/:category', function(req, res) {

  Posts.find({category: req.params.category}, function(err, posts) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }

    res.json({posts});
  });
});

// ADD POST
router.post('/new', function(req, res) {
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
    res.json({post});
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
