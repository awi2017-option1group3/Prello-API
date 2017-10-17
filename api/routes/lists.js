import express from 'express'
import List from '../models/List'
import Card from '../models/Card'
import cards from './cards'

const router = express.Router()

router.delete('/:listId', (req, res) => {
  List.remove({ _id: req.params.listId })
    .catch(err => res.send(err))
    .then(() => Card.remove({ listId: req.params.listId }))
    .catch(err => res.send(err))
    .then(() => res.end())
})

router.get('/', (req, res) => {
  List.find({}, (err, lists) => {
    if (err) {
      res.send(err)
    } else {
      res.json(lists)
    }
  })
})

router.patch('/:listId', (req, res) => {
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

  List.update({ _id: req.params.listId }, newData, {}, (err, listPatched) => {
    if (err) {
      res.send(err)
    } else {
      res.json(listPatched)
    }
  })
})

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

router.use('/:listId/cards', cards)

export default router
