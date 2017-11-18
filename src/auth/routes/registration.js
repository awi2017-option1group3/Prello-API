import express from 'express'
import moment from 'moment'

import User from '../../api/models/User'
import RegistrationCheckToken from '../../api/models/RegistrationCheckToken'

const router = express.Router()


router.post('/:token/validateUser', (req, res) => {
  RegistrationCheckToken.findOne({ token: req.params.token }).exec()
    .catch(err => res.send(err))
    .then((registrationToken) => {
      if (registrationToken) {
        User.update({ _id: registrationToken.userId }, { registrationChecked: true }, {}).exec()
          .catch(err => res.send(err))
        RegistrationCheckToken.remove({ _id: registrationToken.id }).exec()
          .catch(err => res.send(err))
          .then(res.status(200))
      }
    })
})

router.get('/:tokenRegistrationCheck', (req, res) => {

  RegistrationCheckToken.findOne({ token: req.params.tokenRegistrationCheck }).exec()
    .catch(err => res.send(err))
    .then((registrationToken) => {
      if (registrationToken) {
        if (moment().isBefore(moment(registrationToken.timeOut))) {
          User.findOne({ _id: registrationToken.userId }).exec()
            .catch(err => res.send(err))
            .then(user => res.json(user))
        } else {
          User.remove({ _id: registrationToken.userId }).exec()
            .catch(err => res.send(err))
          RegistrationCheckToken.remove({ _id: registrationToken.id }).exec()
            .catch(err => res.send(err))
            .then(res.status(410))
        }
      }
    })
})

export default router
