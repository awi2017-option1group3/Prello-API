import express from 'express'
import Task from '../models/Task'

const router = express.Router()

router.get('/:taskId', (req, res) => {
  Task.find({ _id: req.params.taskId }, (err, task) => {
    if (err) {
      res.send(err)
    } else {
      res.json(task)
    }
  })
})

router.delete('/:taskId', (req, res) => {
  Task.remove({ _id: req.params.taskId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

router.put('/:taskId', (req, res) => {
  const data = {
    ...typeof req.body.title !== 'undefined' && { title: req.body.title },
    ...typeof req.body.done !== 'undefined' && { done: req.body.done },
  }
  Task.findOneAndUpdate(
    { _id: req.params.taskId }, data, {
      safe: true, upsert: true, multi: true, new: true, 
    },
    (err, taskUpdated) => {
      if (err) {
        res.send(err)
      } else {
        res.json(taskUpdated)
      }
    },
  )
})

export default router
