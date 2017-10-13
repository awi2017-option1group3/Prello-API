import express from 'express'
import lists from './lists'

const router = express.Router()

router.use('/lists', lists)

router.get('/', (req, res) => {
  res.send('You are on the Prello API !')
})

export default router
