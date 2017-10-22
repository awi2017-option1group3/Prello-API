import express from 'express'
import Board from '../models/Board'
import List from '../models/List'

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
