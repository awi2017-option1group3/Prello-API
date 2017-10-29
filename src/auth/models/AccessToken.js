import mongoose from 'mongoose'

const Schema = mongoose.Schema

const accessTokenSchema = new Schema({
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: String,
  userId: String,
  expires: Date,
})

accessTokenSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('AccessToken', accessTokenSchema)
