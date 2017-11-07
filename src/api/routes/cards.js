import express from 'express'
import Card from '../models/Card'
import Comment from '../models/Comment'

const router = express.Router({ mergeParams: true })

router.delete('/:cardId', (req, res) => {
  Card.remove({ _id: req.params.cardId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

router.get('/:cardId/', (req, res) => {
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      res.json(card)
    }
  })
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

router.get('/:cardId/comments/', (req, res) => {
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      res.json(card.comments)
    }
  }).populate('comments')
    .populate('comments.userId')
    .exec()
})

router.get('/:cardId/assignees/', (req, res) => {
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      res.json(card.assignees)
    }
  }).populate('assignees')
    .exec()
})

router.get('/:cardId/responsible/', (req, res) => {
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      res.json(card.cardResponsible)
    }
  }).populate('cardResponsible')
    .exec()
})

const cardUpdate = (cardId, update, res) => {
  Card.findOneAndUpdate(
    { _id: cardId },
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
}

router.post('/:cardId/labels/', (req, res) => {
  const update = {
    $push:
    { labels: req.body.labelId },
  }
  cardUpdate(req.params.cardId, update, res)
})

router.post('/:cardId/assignees/', (req, res) => {
  const update = {
    $push:
      { assignees: req.body.memberId },
  }
  cardUpdate(req.params.cardId, update, res)
})

router.post('/:cardId/responsible/', (req, res) => {
  const update = {
    $set:
      { cardResponsible: req.body.responsibleId },
  }
  cardUpdate(req.params.cardId, update, res)
})

router.post('/:cardId/comments/', (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    date: Date.now(),
    userId: req.body.userId,
  })
  Comment.create(comment)
    .then((newComment) => {
      const update = {
        $push:
          { comments: newComment.id },
      }
      cardUpdate(req.params.cardId, update, res)
    })
})

router.put('/:cardId', (req, res) => {
  const data = {
    ...typeof req.body.title !== 'undefined' && { title: req.body.title },
    ...typeof req.body.listId !== 'undefined' && { listId: req.body.listId },
    ...typeof req.body.pos !== 'undefined' && { pos: parseInt(req.body.pos, 10) },
    ...typeof req.body.dueComplete !== 'undefined' && { dueComplete: req.body.dueComplete },
    ...typeof req.body.labels !== 'undefined' && { labels: req.body.labels },
    ...typeof req.body.assignees !== 'undefined' && { assignees: req.body.assignees },
    ...typeof req.body.cardResponsible !== 'undefined' && { cardResponsible: req.body.cardResponsible },
    ...typeof req.body.desc !== 'undefined' && { desc: req.body.desc },
  }
  Card.update({ _id: req.params.cardId }, data, {})
    .catch(err => res.send(err))
    .then(() => Card.findOne({ _id: req.params.cardId })
      .populate('labels')
      .populate('assignees')
      .populate('cardResponsible')
      .populate('comments')
      .exec())
    .catch(err => res.send(err))
    .then(cardUpdated => res.json(cardUpdated))
})

router.delete('/:cardId/assignees/:memberId', (req, res) => {
  let assigneesToUpdate
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      assigneesToUpdate = card.assignees
    }
    assigneesToUpdate = assigneesToUpdate.filter(item => item.toString() !== req.params.memberId)
    const update = {
      $set:
        { assignees: assigneesToUpdate },
    }
    cardUpdate(req.params.cardId, update, res)
  })
})

router.delete('/:cardId/labels/:labelId', (req, res) => {
  let labelsToUpdate
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      labelsToUpdate = card.labels
    }
    labelsToUpdate = labelsToUpdate.filter(item => item.toString() !== req.params.labelId)
    const update = {
      $set:
        { labels: labelsToUpdate },
    }
    cardUpdate(req.params.cardId, update, res)
  })
})

export default router
