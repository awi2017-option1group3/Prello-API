import mongoose from 'mongoose'

const Schema = mongoose.Schema

const cardSchema = new Schema({
  title: {
    type: String,
  },
  rank: {
    type: Number,
  },
  listId: {
    type: Schema.Types.ObjectId,
    ref: 'List',
  },
  labels: [{
    type: Schema.Types.ObjectId,
    ref: 'Label',
  }],
  assignees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  cardResponsible: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

cardSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Card', cardSchema)
