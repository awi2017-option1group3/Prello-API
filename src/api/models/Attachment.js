import mongoose from 'mongoose'

const Schema = mongoose.Schema

const attachmentSchema = new Schema({
  name: {
    type: String,
  },
  desc: {
    type: String,
    default: "",
  },
  driveId: {
    type: String,
  },
  url: {
    type: String,
  },
  icon: {
    type: String,
  },
  lastEditedTime: {
    type: Date,
  },
  cardId: [{
    type: Schema.Types.ObjectId,
    ref: 'Card',
  }],
})

attachmentSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Attachment', attachmentSchema)
