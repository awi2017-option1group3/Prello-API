import express from 'express'
import List from '../models/List'
import Card from '../models/Card'

const router = express.Router()

// TODO remove in favor of Boards routes (when we will have these routes)
router.get('/', (req, res) => {
  List.find({}, (err, lists) => {
    if (err) {
      res.send(err)
    } else {
      res.json(lists)
    }
  })
})

router.get('/:id/cards/', (req, res) => {
  Card.find({ listId: req.params.id }, (err, cards) => {
    if (err) {
      res.send(err)
    } else {
      res.json(cards)
    }
  })
})

// TODO remove in favor of Boards routes (when we will have these routes)
router.post('/', (req, res) => {
  const list = new List({
    title: req.body.title,
    rank: req.body.rank,
  })
  list.save((err, newList) => {
    if (err) {
      res.send(err)
    } else {
      res.json(newList)
    }
  })
})

router.post('/:id/cards/', (req, res) => {
  const card = new Card({
    title: req.body.title,
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
  function checkRequest() {
    if (Object.keys(req.body).length === 2 && Object.keys(req.body).includes('rank') && Object.keys(req.body).includes('title')) {
      const data = {
        rank: parseInt(req.body.rank, 10),
        title: req.body.title,
      }
      return data
    } else if (Object.keys(req.body).length === 1 && Object.keys(req.body).includes('rank')) {
      const data = {
        rank: parseInt(req.body.rank, 10),
      }
      return data
    } else if (Object.keys(req.body).length === 1 && Object.keys(req.body).includes('title')) {
      const data = {
        title: req.body.title,
      }
      return data
    }
    const data = {
      rank: parseInt(req.body.rank, 10),
      title: req.body.title,
      cards: req.body.cards,
    }
    return data
  }

  const newData = checkRequest()

  List.update({ _id: req.params.id }, newData, {}, (err, listPatched) => {
    if (err) {
      res.send(err)
    } else {
      res.json(listPatched)
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
