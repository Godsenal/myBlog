import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: String,
  title: String,
  content: String,
  category: String,
  rating: {type: Number, default: 0},
  viewer: {type: Number, default: 0},
  created: { type: Date, default: Date.now },
});

export default mongoose.model('Post', PostSchema);
