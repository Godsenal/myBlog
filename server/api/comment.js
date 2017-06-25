import Comments from '../models/Comments';
import express from 'express';
const router = express.Router();


//GET ALL Comments with postID
router.get('/list/:postID', function(req, res) {

  Comments.find({postID: req.params.postID}, function(err, comments) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }

    res.json({comments});
  });
});

//NEW COMMENT
router.post('/add', function(req, res) {

  var comment = {
    author: req.body.author,
    postID: req.body.postID,
    content: req.body.content,
    parent: req.body.parent,
  };

  var newComment = new Comments(comment);
  newComment.save(function (err, comment) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }

    res.json({comment});
  });

});

//EDIT COMMENT
router.post('/update', function(req, res) {
  var id = req.body.id;
  var content = req.body.content;

  Comments.findOneAndUpdate({id: id}, {$set:{content:content}},{new: true}, function(err, comment){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({comment});
  });

});

//DELETE CATEGORY
router.post('/delete', function(req, res) {
  var id = req.body.id;
  var parent = req.body.parent;

  if(!parent){
    return res.json({error:'Cannot Delete Root Comment'});
  }

  Comments.remove({id: id},function(err, comment){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({comment});
  });
});


export default router;
