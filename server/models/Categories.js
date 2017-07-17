import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: String,
  parent: {type: String, default:null},
  path: {type: String, default:null},
});

var collectionName = 'Categories';
export default mongoose.model('Category', CategorySchema, collectionName);
