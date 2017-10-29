import express from 'express'
import Card from '../models/Card'

const router = express.Router({ mergeParams: true })

router.delete('/:cardId', (req, res) => {
  Card.remove({ _id: req.params.cardId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

router.get('/:cardId/labels/', (req, res) => {
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      res.json(card.labels)
    }
  }).populate('labels')
    .exec()
})

router.get('/:cardId/members/', (req, res) => {
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      res.json(card.assignees)
    }
  }).populate('assignees')
    .exec()
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

router.post('/:cardId/members/', (req, res) => {
  const update = {
    $push:
      { assignees: req.body.memberId },
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
    ...typeof req.body.assignees !== 'undefined' && { assignees: req.body.assignees },
  }
  Card.update({ _id: req.params.cardId }, data, {})
    .catch(err => res.send(err))
    .then(() => Card.findOne({ _id: req.params.cardId }).populate('labels').populate('assignees').exec())
    .catch(err => res.send(err))
    .then(cardUpdated => res.json(cardUpdated))
})

export default router
