import express from 'express'
import Board from '../models/Board'
import List from '../models/List'
import Label from '../models/Label'
import Card from '../models/Card'

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
      res.sendStatus(404)
    } else {
      res.json(lists)
    }
  })
})

router.get('/:id', (req, res) => {
  Board.findOne({ _id: req.params.id }, (err, board) => {
    if (err) {
      res.sendStatus(404)
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
    pos: req.body.pos,
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

router.put('/:id', (req, res) => { 
  const data = { 
    ...typeof req.body.title !== 'undefined' && { title: req.body.title }, 
  } 
  Board.update({ _id: req.params.id }, data, {}, (err, board) => { 
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

export default router
