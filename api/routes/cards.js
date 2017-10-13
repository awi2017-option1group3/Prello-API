import express from 'express'
import Card from '../models/Card'

const router = express.Router({ mergeParams: true })

router.get('/', (req, res) => {
  Card.find({ list: req.params.listId }, (err, cards) => {
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
    list: req.params.listId,
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
