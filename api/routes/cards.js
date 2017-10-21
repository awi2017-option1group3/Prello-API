import express from 'express'
import Card from '../models/Card'

const router = express.Router({ mergeParams: true })

router.delete('/:id', (req, res) => {
  Card.remove({ _id: req.params.id })
    .catch(err => res.send(err))
    .then(() => res.end())
})

export default router
