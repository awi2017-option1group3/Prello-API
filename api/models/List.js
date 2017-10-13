import mongoose from 'mongoose'

const Schema = mongoose.Schema

const listSchema = new Schema({
  title: {
    type: String,
  },
  rank: {
    type: Number,
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
