import express from 'express'
import Comment from '../models/Comment'

const router = express.Router()

router.get('/:id', (req, res) => {
  Comment.find({ _id: req.params.id }, (err, boards) => {
    if (err) {
      res.send(err)
    } else {
      res.json(boards)
    }
  })
})

router.delete('/:cardId', (req, res) => {
  Comment.remove({ _id: req.params.cardId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

export default router
