import express from 'express'
import Notification from '../models/Notification'

const router = express.Router()

router.put('/:notificationId', (req, res) => {
  const data = {
    ...typeof req.body.isRead !== 'undefined' && { isRead: req.body.isRead },
  }
  Notification.findOneAndUpdate({ _id: req.params.notificationId }, data, {})
    .then(() =>
      Notification.findOne({ _id: req.params.notificationId })
        .populate('board')
        .populate('sourceUser')
        .populate('targetUser')
        .exec())
    .then(notification => res.json(notification))
})

export default router
