import mongoose from 'mongoose';
import Counters from './Counters';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  _id: String,
  author: String,
  title: String,
  thumbnail: {type: String, default: ''},
  content: String, // html
  text: String, // only TEXT
  category: String,
  comments: {type: Array, default: []},
  tags: {type: Array, default: []},
  rating: {type: Number, default: 0},
  viewer: {type: Number, default: 0},
  created: { type: Date, default: Date.now },
});

PostSchema.pre('save',function(next){
  var post = this;
  Counters.findByIdAndUpdate({_id: 'postID'}, {$inc: { seq: 1} },{new: true},function(err, count) {
    post._id = count.seq;
    next();
  });
});

var collectionName = 'Posts';
export default mongoose.model('Post', PostSchema, collectionName);
