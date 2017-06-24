import Categories from '../models/Categories';
import express from 'express';
const router = express.Router();


//GET ALL CATEGORY
router.get('/list', function(req, res) {

  Categories.find({}, function(err, categories) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }

    res.json({categories});
  });
});

//NEW CATEGORY
router.post('/new', function(req, res) {
  var category = {
    name: req.body.name,
    parent: req.body.parent,
  };
  Categories.find({name: category.name}, function(err, category){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    if(category){
      return res.json({error: 'Exist Name', code: 2});
    }
    else{
      var newCategory = new Categories(category);
      newCategory.save(function (err, category) {
        if(err) {
          console.log(err);
          return res.status(500).json({error: 'internal server error', code: 1});
        }

        res.json({category});
      });
    }
  });

});

//RENAME CATEGORY
router.post('/rename', function(req, res) {
  var name = req.body.name;
  var newName = req.body.newName;
  Categories.find({name: newName}, function(err, category){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    if(category){
      return res.json({error: 'Exist Name', code: 2});
    }
    else{
      Categories.findOneAndUpdate({name: name}, {$set:{name:newName}},{new: true}, function(err, category){
        if(err){
          console.log(err);
          return res.status(500).json({error: 'internal server error', code: 1});
        }
        res.json({category});
      });
    }
  });

});

//DELETE CATEGORY
router.post('/delete', function(req, res) {
  var name = req.body.name;
  if(!parent){
    return res.json({error:'Cannot Delete Root Category'});
  }

  Categories.remove({name: name},function(err, category){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({category});
  });
});


export default router;
