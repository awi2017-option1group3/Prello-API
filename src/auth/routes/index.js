import express from 'express'
import auth from './auth'
import clients from './clients'

const router = express.Router()

router.use('/', auth)
router.use('/clients', clients)

export default router
