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
    .populate('labels')
    .populate('assignees')
    .populate('responsible')
    .populate('comments')
    .populate({
      path: 'taskLists',
      populate: {
        path: 'tasks',
        model: 'Task',
      },
    })
    .exec()
})

router.post('/:id/cards/', (req, res) => {
  const card = new Card({
    title: req.body.title,
    desc: req.body.desc,
    pos: req.body.pos,
    listId: req.params.id,
    responsible: null,
    dueComplete: null,
    labels: [],
    assignees: [],
    comments: [],
    taskLists: [],
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
    ...typeof req.body.pos !== 'undefined' && { pos: parseInt(req.body.pos, 10) },
    ...typeof req.body.title !== 'undefined' && { title: req.body.title },
  }
  List.update({ _id: req.params.id }, data, {})
    .catch(err => res.send(err))
    .then(() => List.findOne({ _id: req.params.id }).exec())
    .catch(err => res.send(err))
    .then(listUpdated => res.json(listUpdated))
})

router.delete('/:id', (req, res) => {
  List.remove({ _id: req.params.id })
    .catch(err => res.send(err))
    .then(() => Card.remove({ listId: req.params.id }))
    .catch(err => res.send(err))
    .then(() => res.end())
})

export default router
