import mongoose from 'mongoose'

const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: {
    type: String,
  },
  done: {
    type: String,
  },
})

taskSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Task', taskSchema)
