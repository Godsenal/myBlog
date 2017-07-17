import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  email: String,
  username: String,
  password: String,
  created: { type: Date, default: Date.now },
});
var collectionName = 'Accounts';
export default mongoose.model('Account', AccountSchema, collectionName);
