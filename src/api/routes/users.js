import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'
import Board from '../models/Board'
import Notification from '../models/Notification'

const router = express.Router()

// User

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.send(err)
    } else {
      res.json(users)
    }
  })
})

router.get('/:userId', (req, res) => {
  User.find({ _id: req.params.userId }, (err, boards) => {
    if (err) {
      res.send(err)
    } else {
      res.json(boards)
    }
  })
})

// For tests mainly
router.get('/initials/:initials', (req, res) => {
  User.find({ initials: req.params.initials }, (err, members) => {
    if (err) {
      res.send(err)
    } else {
      res.json(members)
    }
  })
})

// Boards

router.get('/:userId/boards/', (req, res) => {
  User.findOne({ _id: req.params.userId }, (err, user) => {
    if (err) {
      res.send(err)
    } else {
      res.json(user.boards)
    }
  }).populate('boards')
    .exec()
})

router.post('/:userId/boards/', (req, res) => {
  const board = new Board({
    title: req.body.title,
    owner: req.params.userId,
  })
  Board.create(board)
    .then((newBoard) => {
      const update = {
        $push: {
          boards: newBoard.id,
        },
      }
      User.findOneAndUpdate({ _id: req.params.userId }, update, { safe: true, upsert: true }, (err) => {
        if (err) {
          res.send(err)
        } else {
          res.json(newBoard)
        }
      })
    })
})

// Contributing boards

router.get('/:userId/contributingBoards/', (req, res) => {
  User.findOne({ _id: req.params.userId }, (err, user) => {
    if (err) {
      res.send(err)
    } else {
      res.json(user.contributingBoards)
    }
  }).populate('contributingBoards')
    .exec()
})

// Notifications

router.get('/:userId/notifications/', (req, res) => {
  User.findOne({ _id: req.params.userId }, (err, user) => {
    if (err) {
      res.send(err)
    } else {
      res.json(user.notifications)
    }
  }).populate({
    path: 'notifications',
    model: 'Notification',
    populate: [{
      path: 'board',
      model: 'Board',
    }, {
      path: 'targetUser',
      model: 'User',
    }, {
      path: 'sourceUser',
      model: 'User',
    }],
  }).exec()
})

router.post('/:userId/notifications/', (req, res) => {
  const notification = new Notification({
    message: req.body.message,
    occuredAt: new Date(),
    isRead: false,
    board: req.body.boardId,
    sourceUser: req.body.sourceUserId,
    targetUser: req.params.userId,
  })
  Notification.create(notification)
    .then((newNotification) => {
      const update = {
        $push: {
          notifications: newNotification.id,
        },
      }
      User.findOneAndUpdate({ _id: req.params.userId }, update, { safe: true, upsert: true }, (err1) => {
        if (err1) {
          res.send(err1)
        } else {
          Notification.findOne({ _id: newNotification.id })
            .populate('board')
            .populate('sourceUser')
            .populate('targetUser')
            .exec()
            .then(notificationPopulated => res.json(notificationPopulated))
        }
      })
    })
})

router.post('/:userId/update/', (req, res) => {
  if (!req.body.password) {
    const update = {
      $set: {
        fullName: req.body.fullName,
        initials: req.body.fullName.split(' ').map(word => word[0]).join(''),
      },
    }
    User.findOneAndUpdate({ _id: req.params.userId }, update, {}, (err) => {
      if (err) {
        res.send(err)
      } else {
        res.status(200)
      }
    })
  } else {
    const update = {
      $set: {
        fullName: req.body.fullName,
        initials: req.body.fullName.split(' ').map(word => word[0]).join(''),
        password: bcrypt.hashSync(req.body.password, 10),
      },
    }
    User.findOneAndUpdate({ _id: req.params.userId }, update, {}, (err) => {
      if (err) {
        res.send(err)
      } else {
        res.status(200)
      }
    })
  }
})

router.delete('/:userId', (req, res) => {
  User.remove({ _id: req.params.userId })
    .catch(err => res.send(err))
    .then(() => res.end())
})

export default router
