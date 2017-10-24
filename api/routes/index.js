import express from 'express'
import register from './register'
import boards from './boards'
import lists from './lists'
import cards from './cards'

const router = express.Router()

router.use('/register', register)
router.use('/boards', boards)
router.use('/lists', lists)
router.use('/cards', cards)

router.get('/', (req, res) => {
  res.send('You are on the Prello API !')
})

export default router
