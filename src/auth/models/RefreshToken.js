import mongoose from 'mongoose'

const Schema = mongoose.Schema

const refreshTokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: String,
  userId: String,
  expires: Date,
})

refreshTokenSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('RefreshToken', refreshTokenSchema)
