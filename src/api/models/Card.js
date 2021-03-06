import mongoose from 'mongoose'

const Schema = mongoose.Schema

const cardSchema = new Schema({
  title: {
    type: String,
  },
  desc: {
    type: String,
    default: "",
  },
  dueComplete: {
    type: Date,
  },
  pos: {
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
  responsible: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'Attachment',
  }],
  taskLists: [{
    type: Schema.Types.ObjectId,
    ref: 'TaskList',
  }],
})

cardSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Card', cardSchema)
