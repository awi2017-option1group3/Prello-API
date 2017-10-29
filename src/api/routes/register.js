import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'

const router = express.Router()

router.post('/', (req, res) => {
  // TODO: Create a validation system returning beautiful errors
  if (!req.body.fullName) {
    res.send('You must provide your full name.')
  } else if (!req.body.email) {
    res.send('You must provide your email.')
  } else if (!req.body.password || req.body.password.length < 8) {
    res.send('You must provide a password with a least 8 symbols.')
  } else {
    const usernameFragment = req.body.fullName.toLowerCase().replace(' ', '')
    const userData = {
      fullName: req.body.fullName,
      email: req.body.email,
    }
    User.find({ email: req.body.email }).exec()
      .catch(err => res.send(err))
      .then((usersWithSameEmail) => {
        if (usersWithSameEmail.length > 0) {
          res.send('Email already used. Please login instead of register.')
        } else {
          return User.find({ username: new RegExp(usernameFragment, 'i') }).exec()
        }
      })
      .catch(err => res.send(err))
      .then((existingUsers) => {
        userData.username = usernameFragment.concat('.').concat(existingUsers.length + 1)
        userData.initials = req.body.fullName.split(' ').map(word => word[0]).join('')
        return bcrypt.hash(req.body.password, 10)
      })
      .then((passwordHashed) => {
        userData.password = passwordHashed
        const user = new User(userData)
        return user.save()
      })
      .catch(err => res.send(err))
      .then(() => {
        res.status(201).end()
      })
  }
})

export default router
