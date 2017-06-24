import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: String,
  content: String,
  rating: Number,
  created: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', CommentSchema);
