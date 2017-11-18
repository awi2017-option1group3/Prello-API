import mongoose from 'mongoose'

const Schema = mongoose.Schema

const registrationCheckTokenSchema = new Schema({
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

registrationCheckTokenSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('RegistrationCheckToken', registrationCheckTokenSchema)
