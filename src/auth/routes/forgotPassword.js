import express from 'express'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import moment from 'moment'

import ForgotPassword from '../models/forgotPassword'
import User from '../../api/models/User'


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
  const now = moment().add(5, 'm')
  const key = now.toISOString()
  const tokenKey = bcrypt.hashSync(key, 10)
  const tokenUrl = encodeURIComponent(tokenKey)

  User.findOne({ email: req.body.email }).exec()
    .catch(err => res.send(err))
    .then((user) => {
      if (user) {
        const forgotPassword = new ForgotPassword({
          token: tokenKey,
          userId: user.id,
          timeOut: now,
        })
        forgotPassword.save((err) => {
          if (err) {
            res.send(err)
          } else {
            res.status(200)
            const mailOptions = {
              from: '"Prello by Gluon" <prello+forgotpassword@gmail.com>', // sender address
              to: req.body.email, // list of receivers
              subject: 'Forgot password Prello by Gluon ', // Subject line
              text: `Hi ${user.fullName} !` +
              'follow this link to reset your password: ' +
              `https://prello-by-gluon.herokuapp.com/forgotPassword/${tokenUrl}` +
              `Prello Team by Gluon`, // plain text body
              html: `<div><h3>Hi ${user.fullName} !</h3> <p>follow this link to reset your password:</p> 
            <p>https://prello-by-gluon.herokuapp.com/forgotPassword/${tokenUrl} </p><p>Prello Team by Gluon</p></div>`, // html body
            }

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error)
              }
              console.log('Message %s sent: %s', info.messageId, info.response)
            })
          }
        })
      }else {
        res.status(404)
      }
    })
})

router.post('/:token/resetPassword', (req, res) => {
  const hashedpassword = bcrypt.hashSync(req.body.password, 10)
  ForgotPassword.findOne({ token: req.params.token }).exec()
    .catch(err => res.send(err))
    .then((forgotPassword) => {
      if (forgotPassword) {
        User.update({ _id: forgotPassword.userId }, { password: hashedpassword }, {}).exec()
          .catch(err => res.send(err))
        ForgotPassword.remove({ _id: forgotPassword.id }).exec()
          .catch(err => res.send(err))
          .then(res.status(200))
      }
    })
})

router.get('/:tokenForgotPassword', (req, res) => {
  ForgotPassword.findOne({ token: req.params.tokenForgotPassword }).exec()
    .catch(err => res.send(err))
    .then((forgotPassword) => {
      if (forgotPassword) {
        if (moment().isBefore(moment(forgotPassword.timeOut))) {
          User.findOne({ _id: forgotPassword.userId }).exec()
            .catch(err => res.send(err))
            .then(user => res.json(user))
        } else {
          ForgotPassword.remove({ _id: forgotPassword.id }).exec()
            .catch(err => res.send(err))
            .then(res.status(410))
        }
      }
    })
})

export default router
