import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: String,
  parent: {type: String, default:null},
  content: String,
  rating: {type: Number, default: 0},
  created: { type: Date, default: Date.now },
});
var collectionName = 'Comments';
export default mongoose.model('Comment', CommentSchema, collectionName);
