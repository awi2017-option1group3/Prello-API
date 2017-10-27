import express from 'express'
import Card from '../models/Card'
import Label from '../models/Label'

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

router.get('/:cardId/labels/', (req, res) => {
  Label.find({ _id: req.params.cardId }, (err, cards) => {
    if (err) {
      res.send(err)
    } else {
      res.json(cards.labels.populate())
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

router.post('/:cardId/labels/', (req, res) => {
  const update = {
    $push:
    { labels: req.body.labelId },
  }
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    update,
    { safe: true, upsert: true },
    (err, cardUpdated) => {
      if (err) {
        res.send(err)
      } else {
        res.json(cardUpdated)
      }
    },
  )
})

router.put('/:cardId', (req, res) => {
  const data = {
    ...typeof req.body.title !== 'undefined' && { title: req.body.title },
    ...typeof req.body.listId !== 'undefined' && { listId: req.body.listId },
    ...typeof req.body.rank !== 'undefined' && { rank: parseInt(req.body.rank, 10) },
    ...typeof req.body.labels !== 'undefined' && { labels: req.body.labels },
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
