import express from 'express'
import boards from './boards'
import lists from './lists'
import cards from './cards'
import users from './users'
import comments from './comments'

const router = express.Router()

router.use('/boards', boards)
router.use('/lists', lists)
router.use('/cards', cards)
router.use('/users', users)
router.use('/comments', comments)

router.get('/', (req, res) => {
  res.send('You are on the Prello API !')
})

export default router
