import express from 'express'
import Card from '../models/Card'

const router = express.Router({ mergeParams: true })

router.get('/', (req, res) => {
  Card.find({ listId: req.params.listId }, (err, cards) => {
    if (err) {
      res.send(err)
    } else {
      res.json(cards)
    }
  })
})

router.post('/', (req, res) => {
  const card = new Card({
    title: req.body.title,
    listId: req.params.listId,
  })
  card.save((err, newCard) => {
    if (err) {
      res.send(err)
    } else {
      res.json(newCard)
    }
  })
})

router.delete('/:cardId', (req, res) => {
  Card.remove({ _id: req.params.cardId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

export default router
