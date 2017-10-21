import express from 'express'
import lists from './lists'
import cards from './cards'

const router = express.Router()

router.use('/lists', lists)
router.use('/cards', cards)

router.get('/', (req, res) => {
  res.send('You are on the Prello API !')
})

export default router
