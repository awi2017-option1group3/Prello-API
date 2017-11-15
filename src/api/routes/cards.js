import express from 'express'
import Card from '../models/Card'
import Comment from '../models/Comment'
import TaskList from '../models/TaskList'
import Task from '../models/Task'

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

router.get('/:cardId/populated/', (req, res) => {
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      res.json(card)
    }
  }).populate('labels')
    .populate('assignees')
    .populate('responsible')
    .populate('comments')
    .populate('taskLists')
    .exec()
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

router.get('/:cardId/tasklists/', (req, res) => {
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      res.json(card.taskLists)
    }
  }).populate({
    path: 'taskLists',
    model: 'TaskList',
    populate: {
      path: 'tasks',
      model: 'Task',
    },
  }).exec()
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
      res.json(card.responsible)
    }
  }).populate('responsible')
    .exec()
})

const cardUpdate = (cardId, update, populatePath, populateModel, res) => {
  if (cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findOneAndUpdate(
      { _id: cardId },
      update,
      { safe: true, upsert: true, new : true },
      (err, cardUpdated) => {
        if (err) {
          res.send(err)
        } else {
          Card.populate(cardUpdated, {
            path: populatePath,
            model: populateModel,
          }, (err2, cardUpdated2) => {
            if (err) {
              res.send(err2)
            } else {
              res.json(cardUpdated2[populatePath])
            }
          })
        }
      },
    )
  }
}

router.post('/:cardId/labels/', (req, res) => {
  const update = {
    $push:
    { labels: req.body.labelId },
  }
  cardUpdate(req.params.cardId, update, 'labels', 'Label', res)
})

router.post('/:cardId/assignees/', (req, res) => {
  const update = {
    $push:
      { assignees: req.body.memberId },
  }
  cardUpdate(req.params.cardId, update, 'assignees', 'User', res)
})

router.post('/:cardId/responsible/', (req, res) => {
  const update = {
    $set:
      { responsible: req.body.responsibleId },
  }
  cardUpdate(req.params.cardId, update, 'responsible', 'User', res)
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
      cardUpdate(req.params.cardId, update, 'comments', 'Comment', res)
    })
})

router.post('/:cardId/tasklists/', (req, res) => {
  const taskList = new TaskList({
    title: req.body.title,
    tasks: [],
    cardId: req.params.cardId,
  })
  TaskList.create(taskList)
    .then((newTaskList) => {
      const update = {
        $push:
          { taskLists: newTaskList.id },
      }
      cardUpdate(req.params.cardId, update, 'taskLists', 'TaskList', res)
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
    ...typeof req.body.responsible !== 'undefined' && { responsible: req.body.responsible },
    ...typeof req.body.desc !== 'undefined' && { desc: req.body.desc },
  }
  Card.update({ _id: req.params.cardId }, data, { new: true })
    .catch(err => res.send(err))
    .then(() => Card.findOne({ _id: req.params.cardId })
      .populate('labels')
      .populate('assignees')
      .populate('responsible')
      .populate('comments')
      .exec())
    .catch(err => res.send(err))
    .then(cardUpdated => res.json(cardUpdated))
})

router.delete('/:cardId/assignees/:memberId', (req, res) => {
  const update = {
    $pull: {
      contributors: req.params.memberId,
    },
  }
  cardUpdate(req.params.cardId, update, 'assignees', 'User', res)
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
    cardUpdate(req.params.cardId, update, 'labels', 'Label', res)
  })
})

router.delete('/:cardId/responsible/', (req, res) => {
  const update = {
    $set:
      { responsible: null },
  }
  cardUpdate(req.params.cardId, update, 'responsible', 'User', res)
})

export default router
