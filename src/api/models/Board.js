import mongoose from 'mongoose'

const Schema = mongoose.Schema

const boardSchema = new Schema({
  title: {
    type: String,
  },
  listsIds: [{
    type: Schema.Types.ObjectId,
    ref: 'List',
  }],
})

boardSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Board', boardSchema)
