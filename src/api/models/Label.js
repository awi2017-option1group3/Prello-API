import mongoose from 'mongoose'

const Schema = mongoose.Schema

const labelSchema = new Schema({
  name: {
    type: String,
  },
  color: {
    type: String,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
  },
})

labelSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Label', labelSchema)
