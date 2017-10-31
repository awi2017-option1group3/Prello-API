import express from 'express'
import User from '../models/User'

const router = express.Router()

router.get('/:id', (req, res) => {
  User.find({ _id: req.params.id }, (err, boards) => {
    if (err) {
      res.send(err)
    } else {
      res.json(boards)
    }
  })
})

// For tests mainly
router.get('/initials/:initials', (req, res) => {
  User.find({ initials: req.params.initials }, (err, members) => {
    if (err) {
      res.send(err)
    } else {
      res.json(members)
    }
  })
})

export default router
