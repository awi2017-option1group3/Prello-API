import express from 'express'
import User from '../models/User'
import Board from '../models/Board'

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

export default router
