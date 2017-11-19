import express from 'express'
import User from '../models/User'
import Board from '../models/Board'
import List from '../models/List'
import Label from '../models/Label'
import Card from '../models/Card'

const router = express.Router()

// Board

router.get('/:boardId', (req, res) => {
  Board.findOne({ _id: req.params.boardId }, (err, board) => {
    if (err) {
      res.sendStatus(404)
    } else {
      res.json(board)
    }
  })
})

router.put('/:boardId', (req, res) => {
  const data = {
    ...typeof req.body.title !== 'undefined' && { title: req.body.title },
  }
  Board.update({ _id: req.params.boardId }, data, {}, (err, board) => {
    if (err) {
      res.send(err)
    } else {
      res.json(board)
    }
  })
})

router.delete('/:boardId', (req, res) => {
  Board.remove({ _id: req.params.boardId })
    .catch(err => res.send(err))
    .then(() => {
      List.find({ boardId: req.params.boardId }, (err, lists) => {
        if (err) {
          res.send(err)
        } else {
          lists.forEach((list) => {
            Card.remove({ listId: list.id })
            list.remove()
          }, this)
        }
      })
    })
    .catch(err => res.send(err))
    .then(() => res.end())
})

// Owner

router.get('/:boardId/owner', (req, res) => {
  Board
    .findOne({ _id: req.params.boardId })
    .populate('owner')
    .exec()
    .catch(() => res.sendStatus(404))
    .then(board => res.json(board.owner))
})

// Contributors

router.get('/:boardId/contributors', (req, res) => {
  Board
    .findOne({ _id: req.params.boardId })
    .populate('contributors')
    .exec()
    .catch(() => res.sendStatus(404))
    .then(board => res.json(board.contributors))
})

// Link a board and an user (both ways) to allow contributions
router.post('/:boardId/contributors/', (req, res) => {
  const boardUpdate = {
    $addToSet: {
      contributors: req.body.userId,
    },
  }
  const userUpdate = {
    $addToSet: {
      contributingBoards: req.params.boardId,
    },
  }
  Board
    .findOneAndUpdate({ _id: req.params.boardId }, boardUpdate, { safe: true, upsert: true, new: true }).exec()
    .then(() => User.findOneAndUpdate({ _id: req.body.userId }, userUpdate, { safe: true, upsert: true, new: true }).exec())
    .then(() => User.findOne({ _id: req.body.userId }).exec())
    .then(user => res.json(user))
})

router.delete('/:boardId/contributors/:userId', (req, res) => {
  const boardUpdate = {
    $pull: {
      contributors: req.params.userId,
    },
  }
  const userUpdate = {
    $pull: {
      contributingBoards: req.params.boardId,
    },
  }
  Board
    .findOneAndUpdate({ _id: req.params.boardId }, boardUpdate, { safe: true, upsert: true, new: true }).exec()
    .then(() => User.findOneAndUpdate({ _id: req.params.userId }, userUpdate, { safe: true, upsert: true, new: true }).exec())
    .then(() => res.end())
})

// Lists

router.get('/:boardId/lists/', (req, res) => {
  List.find({ boardId: req.params.boardId }, (err, lists) => {
    if (err) {
      res.sendStatus(404)
    } else {
      res.json(lists)
    }
  })
})

router.post('/:boardId/lists/', (req, res) => {
  const list = new List({
    title: req.body.title,
    pos: req.body.pos,
    boardId: req.params.boardId,
  })
  list.save((err, newList) => {
    if (err) {
      res.send(err)
    } else {
      res.json(newList)
    }
  })
})

// Labels

router.get('/:boardId/labels', (req, res) => {
  Board.findOne({ _id: req.params.boardId }, (err, board) => {
    if (err) {
      res.send(err)
    } else {
      res.json(board.labels)
    }
  }).populate('labels')
    .exec()
})

router.post('/:boardId/labels/', (req, res) => {
  const label = new Label({
    name: req.body.name,
    color: req.body.color,
    boardId: req.params.boardId,
  })
  Label.create(label)
    .then((newLabel) => {
      const boardUpdate = {
        $push: {
          labels: newLabel.id,
        },
      }
      Board.findOneAndUpdate({ _id: req.params.boardId }, boardUpdate, { safe: true, upsert: true, new: true }, (err) => {
        if (err) {
          res.send(err)
        } else {
          res.json(newLabel)
        }
      })
    })
})

router.delete('/:boardId/labels/:labelId', (req, res) => {
  const boardUpdate = {
    $pull: {
      labels: req.params.labelId,
    },
  }
  const cardUpdate = {
    $pull: {
      labels: req.params.labelId,
    },
  }
  Board
    .findOneAndUpdate({ _id: req.params.boardId }, boardUpdate, { safe: true, upsert: true, new: true }).exec()
    .then(() => Card.updateMany({}, cardUpdate, { safe: true, upsert: true, new: true }))
    .then(() => res.end())
})

export default router
