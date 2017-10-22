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

router.patch('/:listId', (req, res) => {
  const newData = {
    rank: parseInt(req.body.rank, 10),
    listId: req.body.listId,
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

router.put('/:cardId', (req, res) => {
  const data = {
    ...typeof req.body.title !== 'undefined' && { title: req.body.title },
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
