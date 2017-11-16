import express from 'express'
import Comment from '../models/Comment'

const router = express.Router()

router.get('/:commentId', (req, res) => {
  Comment.find({ _id: req.params.commentId }, (err, comment) => {
    if (err) {
      res.send(err)
    } else {
      res.json(comment)
    }
  })
})

router.delete('/:commentId', (req, res) => {
  Comment.remove({ _id: req.params.commentId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

export default router
