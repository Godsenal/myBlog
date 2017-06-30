import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  email: String,
  nickname: String,
  password: String,
  created: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false},
});
var collectionName = 'Accounts';
export default mongoose.model('Account', AccountSchema, collectionName);
