import express from 'express'
import Board from '../models/Board'
import List from '../models/List'
import Label from '../models/Label'

const router = express.Router()

router.get('/', (req, res) => {
  Board.find({}, (err, boards) => {
    if (err) {
      res.send(err)
    } else {
      res.json(boards)
    }
  })
})

router.get('/:id/lists/', (req, res) => {
  List.find({ boardId: req.params.id }, (err, lists) => {
    if (err) {
      res.send(err)
    } else {
      res.json(lists)
    }
  })
})

router.get('/:id', (req, res) => {
  Board.findOne({ _id: req.params.id }, (err, board) => {
    if (err) {
      res.send(err)
    } else {
      res.json(board)
    }
  })
})

router.get('/:id/labels', (req, res) => {
  Label.find({ boardId: req.params.id }, (err, labels) => {
    if (err) {
      res.send(err)
    } else {
      res.json(labels)
    }
  })
})
      
router.post('/', (req, res) => {
  const board = new Board({
    title: req.body.title,
  })
  board.save((err, newBoard) => {
    if (err) {
      res.send(err)
    } else {
      res.json(newBoard)
    }
  })
})

router.post('/:id/labels/', (req, res) => {
  const label = new Label({
    name: req.body.name,
    color: req.body.color,
    boardId: req.params.id,
  })
  label.save((err, newLabel) => {
    if (err) {
      res.send(err)
    } else {
      res.json(newLabel)
    }
  })
})

router.post('/:id/lists/', (req, res) => {
  const list = new List({
    title: req.body.title,
    rank: req.body.rank,
    boardId: req.params.id,
  })
  list.save((err, newList) => {
    if (err) {
      res.send(err)
    } else {
      res.json(newList)
    }
  })
})

export default router
