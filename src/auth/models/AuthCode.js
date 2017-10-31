import mongoose from 'mongoose'

const Schema = mongoose.Schema

const authCodeSchema = new Schema({
  authCode: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: String,
  userId: String,
  expires: Date,
})

authCodeSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('AuthCode', authCodeSchema)
