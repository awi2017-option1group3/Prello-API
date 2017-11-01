import mongoose from 'mongoose'

const Schema = mongoose.Schema

const cardSchema = new Schema({
  title: {
    type: String,
  },
  dueComplete: {
    type: Date,
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
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
})

cardSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Card', cardSchema)
