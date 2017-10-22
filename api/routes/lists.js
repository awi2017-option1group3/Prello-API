import express from 'express'
import List from '../models/List'
import Card from '../models/Card'

const router = express.Router()

router.get('/:id/cards/', (req, res) => {
  Card.find({ listId: req.params.id }, (err, cards) => {
    if (err) {
      res.send(err)
    } else {
      res.json(cards)
    }
  })
})

router.post('/:id/cards/', (req, res) => {
  const card = new Card({
    title: req.body.title,
    rank: req.body.rank,
    listId: req.params.id,
  })
  card.save((err, newCard) => {
    if (err) {
      res.send(err)
    } else {
      res.json(newCard)
    }
  })
})

router.put('/:id', (req, res) => {
  const data = {
    ...typeof req.body.rank !== 'undefined' && { rank: parseInt(req.body.rank, 10) },
    ...typeof req.body.title !== 'undefined' && { title: req.body.title },
  }
  List.update({ _id: req.params.id }, data, {}, (err, listUpdated) => {
    if (err) {
      res.send(err)
    } else {
      res.json(listUpdated)
    }
  })
})

router.delete('/:id', (req, res) => {
  List.remove({ _id: req.params.id })
    .catch(err => res.send(err))
    .then(() => Card.remove({ listId: req.params.id }))
    .catch(err => res.send(err))
    .then(() => res.end())
})

export default router
