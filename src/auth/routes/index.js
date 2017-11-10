import express from 'express'
import auth from './auth'
import clients from './clients'
import tokens from './tokens'

const router = express.Router()

router.use('/', auth)
router.use('/clients', clients)
router.use('/tokens', tokens)

export default router
