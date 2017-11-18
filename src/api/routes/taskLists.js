import express from 'express'
import TaskList from '../models/TaskList'
import Task from '../models/Task'

const router = express.Router()

router.get('/:taskListlId', (req, res) => {
  TaskList.find({ _id: req.params.taskListlId }, (err, task) => {
    if (err) {
      res.send(err)
    } else {
      res.json(task)
    }
  })
})

router.delete('/:tasklistlId', (req, res) => {
  TaskList.remove({ _id: req.params.tasklistlId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

router.post('/:tasklistId/tasks/', (req, res) => {
  const task = new Task({
    title: req.body.title,
    done: false,
    taskListId: req.params.tasklistId,
  })
  Task.create(task)
    .then((newTask) => {
      const update = {
        $push:
          { tasks: newTask.id },
      }
      TaskList.findOneAndUpdate(
        { _id: req.params.tasklistId },
        update,
        {
          safe: true, upsert: true, multi: true, new: true, 
        },
        (err, tasklistUpdated) => {
          if (err) {
            res.send(err)
          } else {
            TaskList.populate(tasklistUpdated, {
              path: 'tasks',
              model: 'Task',
            }, (err2, tasklistUpdated2) => {
              if (err) {
                res.send(err2)
              } else {
                res.json(tasklistUpdated2.tasks)
              }
            })
          }
        },
      )
    })
})

router.delete('/:tasklistId', (req, res) => {
  TaskList.remove({ _id: req.params.tasklistId })
    .catch(err => res.send(err))
    .then(() => Task.remove({ taskListId: req.params.tasklistId }))
    .catch(err => res.send(err))
    .then(() => res.end())
})

router.delete('/:tasklistId/tasks/:taskId', (req, res) => {
  const update = {
    $pull:
      { tasks: req.params.taskId },
  }
  Task.remove({ taskListId: req.params.taskId })
    .catch(err => res.send(err))
    .then(TaskList.findOneAndUpdate(
      { _id: req.params.tasklistId },
      update,
      {
        safe: true, upsert: true, multi: true, new: true, 
      },
      (err, tasklistUpdated) => {
        if (err) {
          res.send(err)
        } else {
          TaskList.populate(tasklistUpdated, {
            path: 'tasks',
            model: 'Task',
          }, (err2, tasklistUpdated2) => {
            if (err) {
              res.send(err2)
            } else {
              res.json(tasklistUpdated2.tasks)
            }
          })
        }
      },
    ))
})

router.put('/:tasklistId', (req, res) => {
  const data = {
    ...typeof req.body.title !== 'undefined' && { title: req.body.title },
  }
  TaskList.findOneAndUpdate({ _id: req.params.tasklistId }, data, {
    safe: true, upsert: true, multi: true, new: true, 
  }).populate({
    path: 'tasks',
    model: 'Task',
  })
    .exec()
    .catch(err => res.send(err))
    .then(taskUpdated => res.json(taskUpdated))
})

export default router
