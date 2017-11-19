import express from 'express'
import Card from '../models/Card'
import Comment from '../models/Comment'
import Attachment from '../models/Attachment'
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
    .populate({
      path: 'taskLists',
      model: 'TaskList',
      populate: {
        path: 'tasks',
        model: 'Task',
      },
    })
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
    .populate({
      path: 'comments',
      model: 'Comment',
      populate: {
        path: 'user',
        model: 'User',
      },
    })
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

router.get('/:cardId/attachments/', (req, res) => {
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      res.json(card.attachments)
    }
  }).populate('attachments')
    .exec()
})

const cardUpdate = (cardId, update, populatePath, populateModel, res) => {
  if (cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findOneAndUpdate(
      { _id: cardId },
      update,
      { safe: true, upsert: true, new: true },
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
    user: req.body.userId,
  })
  Comment
    .create(comment)
    .then((newComment) => {
      const update = {
        $push:
          { comments: newComment.id },
      }
      Card
        .findOneAndUpdate({ _id: req.params.cardId }, update, { safe: true, upsert: true, new: true }).exec()
        .then(() => Comment.findOne({ _id: newComment.id }).populate('user').exec())
        .then(commentPopulated => res.json(commentPopulated))
    })
})

router.post('/:cardId/attachments/', (req, res) => {
  const attachment = new Attachment({
    name: req.body.name,
    desc: req.body.desc,
    driveId: req.body.attachmentId,
    url: req.body.attachmentUrl,
    icon: req.body.attachmentIcon,
    lastEditedTime: req.body.lastEditedTime,
    cardId: req.params.cardId,
  })
  Attachment
    .create(attachment)
    .then((newAttachment) => {
      const update = {
        $push:
          { attachments: newAttachment.id },
      }
      Card
        .findOneAndUpdate({ _id: req.params.cardId }, update, { safe: true, upsert: true, new: true }).exec()
        .then(() => res.json(newAttachment))
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
      .populate('taskLists')
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

router.delete('/:cardId/attachments/:attachmentId', (req, res) => {
  let attachmentsToUpdate
  Card.findOne({ _id: req.params.cardId }, (err, card) => {
    if (err) {
      res.send(err)
    } else {
      attachmentsToUpdate = card.attachments
    }
    attachmentsToUpdate = attachmentsToUpdate.filter(item => item.toString() !== req.params.attachmentId)
    const update = {
      $set:
        { attachments: attachmentsToUpdate },
    }
    cardUpdate(req.params.cardId, update, 'attachments', 'Attachment', res)
  })
})

router.delete('/:cardId/responsible/', (req, res) => {
  const update = {
    $set:
      { responsible: null },
  }
  cardUpdate(req.params.cardId, update, 'responsible', 'User', res)
})

router.delete('/:cardId/tasklists/:tasklistId', (req, res) => {
  const update = {
    $pull:
      { taskLists: req.params.tasklistId },
  }
  TaskList.remove({ _id: req.params.tasklistId })
    .catch(err => res.send(err))
    .then(() => Task.remove({ taskListId: req.params.tasklistId }))
    .catch(err => res.send(err))
    .then(cardUpdate(req.params.cardId, update, 'taskLists', 'TaskList', res))
})

export default router
