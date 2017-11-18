import express from 'express'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import moment from 'moment'
import User from '../models/User'
import RegistrationCheckToken from '../models/RegistrationCheckToken'

const router = express.Router()
const env = Object.assign({}, process.env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SMTP_ID,
    pass: env.SMTP_PASSWORD,
  },
})

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
    const offset = moment().add(1, 'h')
    const key = offset.toISOString()
    const tokenKey = bcrypt.hashSync(key, 10)
    const tokenUrl = encodeURIComponent(tokenKey)

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
      .then((user) => {
        if (user) {
          const checkRegistration = new RegistrationCheckToken({
            token: tokenKey,
            userId: user.id,
            timeOut: offset,
          })
          checkRegistration.save((err) => {
            if (err) {
              res.send(err)
            } else {
              res.status(201)
              const mailOptions = {
                from: '"Prello by Gluon" <prello+registration@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'Registration link Prello by Gluon ', // Subject line
                text: `Hi ${user.fullName} !` +
                  'We are so glad that you chose to join us on Prello platform. ' +
                'Follow this link to validate your account on Prello: ' +
                `${env.CLIENT_URL}/registration/${tokenUrl}` +
                'If you didn\'t register on prello platform and you received this email, ignore this email' +
                'Prello Team by Gluon', // plain text body
                html: `<div><h3>Hi ${user.fullName} !</h3> 
                <p>We are so glad that you chose to join us on Prello platform.</p>
                <p>Follow this link to validate your account on Prello:</p> 
                <p>${env.CLIENT_URL}/registration/${tokenUrl} </p>
                <p>If you didn't register on prello platform and you received this email, ignore this email</p>
                <p>Prello Team by Gluon</p></div>`, // html body
              }

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return console.log(error)
                }
                console.log('Message %s sent: %s', info.messageId, info.response)
              })
            }
          })
        } else {
          res.status(404)
        }
      })
  }
})

export default router
