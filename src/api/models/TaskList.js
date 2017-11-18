import mongoose from 'mongoose'

const Schema = mongoose.Schema

const taskListSchema = new Schema({
  title: {
    type: String,
    default: '',
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
  cardId: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
  },
})

taskListSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('TaskList', taskListSchema)
