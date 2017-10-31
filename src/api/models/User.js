import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  initials: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  passwordResetToken: String,
  resetTokenExpires: Date,
  boardsIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Board',
  }],
})

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
    delete ret.password
    delete ret.boardsIds
  },
})


export default mongoose.model('User', userSchema)
