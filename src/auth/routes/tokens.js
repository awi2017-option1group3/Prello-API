import express from 'express'
import AccessToken from '../models/AccessToken'
import User from '../../api/models/User'

const router = express.Router()

router.get('/:token', (req, res) => {
  AccessToken.findOne({ accessToken: req.params.token }).exec()
    .catch(err => res.send(err))
    .then(accessToken => User.findOne({ email: accessToken.userId }))
    .catch(err => res.send(err))
    .then(user => res.json(user))
})

export default router
