import mongoose from 'mongoose'

const Schema = mongoose.Schema

const boardSchema = new Schema({
  title: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  contributors: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  labels: [{
    type: Schema.Types.ObjectId,
    ref: 'Label',
  }],
  listsIds: [{
    type: Schema.Types.ObjectId,
    ref: 'List',
  }],
})

boardSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Board', boardSchema)
