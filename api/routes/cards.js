import express from 'express'
import Card from '../models/Card'

const router = express.Router({ mergeParams: true })

router.delete('/:cardId', (req, res) => {
  Card.remove({ _id: req.params.cardId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

router.get('/', (req, res) => {
  Card.find({ listId: req.params.listId }, (err, cards) => {
    if (err) {
      res.send(err)
    } else {
      res.json(cards)
    }
  })
})

router.patch('/:cardId', (req, res) => {
  const newData = {
    listId: req.body.listId,
    rank: parseInt(req.body.rank, 10),
  }
  Card.update({ _id: req.params.cardId }, newData, {}, (err, cardPatched) => {
    if (err) {
      res.send(err)
    } else {
      res.json(cardPatched)
    }
  })
})

router.post('/', (req, res) => {
  const card = new Card({
    title: req.body.title,
    rank: req.body.rank,
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

export default router
