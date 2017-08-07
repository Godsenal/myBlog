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
router.post('/add', function(req, res) {
  var category = {
    name: req.body.name,
  };
  if('path' in req.body){
    category.path = req.body.path;
  }

  Categories.find({name: category.name}, function(err, categories){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    if(categories.length){
      return res.status(500).json({error: 'Exist Name', code: 2});
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
router.put('/update', function(req, res) {
  var id = req.body.categoryID;
  var update = req.body.update;
  Categories.findByIdAndUpdate(id, update,{new: true}, function(err, category){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({category});
  });
});

//DELETE CATEGORY
router.delete('/delete/:categoryID/:categoryName', function(req, res) {
  var re = ','+req.params.categoryName+',';
  Categories.remove({$or:[{_id: req.params.categoryID},{path: {$regex:re}}]},function(err){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({categoryID: req.params.categoryID});
  });
});

//GET CATEGORY
router.get('/get/:categoryName', function(req, res) {
  Categories.findOne({name: req.params.categoryName},function(err, category){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    if(!category){
      res.json({});
    }
    else{
      res.json({category});
    }
  });
});

export default router;
