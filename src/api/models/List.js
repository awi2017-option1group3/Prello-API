import mongoose from 'mongoose'

const Schema = mongoose.Schema

const listSchema = new Schema({
  title: {
    type: String,
  },
  pos: {
    type: Number,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
  },
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'Card',
  }],
})

listSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('List', listSchema)
