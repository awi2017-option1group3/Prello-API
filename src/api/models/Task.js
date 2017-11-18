import mongoose from 'mongoose'

const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: {
    type: String,
  },
  done: {
    type: Boolean,
  },
  taskListId: {
    type: Schema.Types.ObjectId,
    ref: 'TaskList',
  },
})

taskSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Task', taskSchema)
