import mongoose from 'mongoose'

const Schema = mongoose.Schema

const forgotPasswordSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timeOut: Date,
})

forgotPasswordSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('ForgotPassword', forgotPasswordSchema)
