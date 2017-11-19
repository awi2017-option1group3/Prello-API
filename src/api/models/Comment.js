import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  content: {
    type: String,
  },
  date: {
    type: Date,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

commentSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Comment', commentSchema)
