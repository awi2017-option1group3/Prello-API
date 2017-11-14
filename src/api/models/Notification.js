import mongoose from 'mongoose'

const Schema = mongoose.Schema

const notificationSchema = new Schema({
  message: String,
  occuredAt: Date,
  isRead: Boolean,
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
  },
  sourceUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  targetUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

notificationSchema.set('toJSON', {
  virtuals: true,
})


export default mongoose.model('Notification', notificationSchema)
