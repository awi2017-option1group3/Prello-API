import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  content: {
    type: String,
  },
  date: {
    type: Date,
  },
  cardId: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

commentSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Comment', commentSchema)
