import mongoose from 'mongoose'

const Schema = mongoose.Schema

const clientSchema = new Schema({
  clientId: String,
  clientSecret: String,
  redirectUri: String,
})

clientSchema.set('toJSON', {
  virtuals: true,
})

export default mongoose.model('Client', clientSchema)
