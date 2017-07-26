import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: String,
  title: String,
  thumbnail: {type: String, default: ''},
  content: String, // html
  text: String, // only TEXT
  category: String,
  comments: {type: Array, default: []},
  rating: {type: Number, default: 0},
  viewer: {type: Number, default: 0},
  created: { type: Date, default: Date.now },
});
var collectionName = 'Posts';
export default mongoose.model('Post', PostSchema, collectionName);
