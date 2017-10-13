import mongoose from 'mongoose'

const Schema = mongoose.Schema

const cardSchema = new Schema({
  title: {
    type: String,
  },
  listId: {
    type: Schema.Types.ObjectId,
    ref: 'List',
  },
})

cardSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Card', cardSchema)
