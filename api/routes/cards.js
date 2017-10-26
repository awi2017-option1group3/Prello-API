import express from 'express'
import Card from '../models/Card'

const router = express.Router({ mergeParams: true })

router.delete('/:cardId', (req, res) => {
  Card.remove({ _id: req.params.cardId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

router.put('/:cardId', (req, res) => {
  const data = {
    ...typeof req.body.title !== 'undefined' && { title: req.body.title },
    ...typeof req.body.listId !== 'undefined' && { listId: req.body.listId },
    ...typeof req.body.rank !== 'undefined' && { rank: parseInt(req.body.rank, 10) },
  }
  Card.update({ _id: req.params.cardId }, data, {}, (err, cardUpdated) => {
    if (err) {
      res.send(err)
    } else {
      res.json(cardUpdated)
    }
  })
})

export default router
