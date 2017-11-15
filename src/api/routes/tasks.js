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

export default router
