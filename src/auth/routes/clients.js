import express from 'express'
import bcrypt from 'bcrypt'
import Client from '../models/Client'

const router = express.Router()

router.get('/', (req, res) => {
  res.render('clientRegister', {
    message: '',
  })
})

router.post('/', (req, res) => {
  if (!req.body.companyName) {
    res.render('clientRegister', {
      companyName: req.body.companyName,
      appName: req.body.appName,
      password: req.body.password,
      message: 'You must provide a company name.',
    })
  } else if (req.body.companyName.length < 3 || req.body.companyName.length > 18) {
    res.render('clientRegister', {
      companyName: req.body.companyName,
      appName: req.body.appName,
      password: req.body.password,
      message: "Your company name's length must be between 3 and 18 characters.",
    })
  } else if (!req.body.appName) {
    res.render('clientRegister', {
      companyName: req.body.companyName,
      appName: req.body.appName,
      password: req.body.password,
      message: 'You must provide an application name. ',
    })
  } else if (req.body.appName.length < 3 || req.body.appName.length > 18) {
    res.render('clientRegister', {
      companyName: req.body.companyName,
      appName: req.body.appName,
      password: req.body.password,
      message: "Your application name's length must be between 3 and 18 characters.",
    })
  } else if (!req.body.password) {
    res.render('clientRegister', {
      companyName: req.body.companyName,
      appName: req.body.appName,
      password: req.body.password,
      message: 'You must provide a password. ',
    })
  } else {
    const clientId = `${req.body.companyName}_${req.body.appName}`
    Client.findOne({ clientId })
      .then((client) => {
        if (client) {
          res.render('clientRegister', {
            companyName: req.body.companyName,
            appName: '',
            password: req.body.password,
            message: `An account for the client ${clientId} already exists, please use the provided keys or create another client account with another application name.`,
          })
        } else {
          return bcrypt.hash(req.body.password, 10)
        }
      })
      .then((secret) => {
        const client = new Client({
          clientId,
          clientSecret: secret,
        })
        return client.save()
      })
      .then((client) => {
        res.render('clientResult', {
          clientId: client.clientId,
          clientSecret: client.clientSecret,
        })
      })
  }
})

export default router
