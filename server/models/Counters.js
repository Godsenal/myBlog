import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  _id: {type: String, required: true},
  seq: {type: Number, default: 100},
});
var collectionName = 'Counters';
export default mongoose.model('Counter', CounterSchema, collectionName);
