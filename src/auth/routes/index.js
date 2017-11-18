import express from 'express'
import auth from './auth'
import clients from './clients'
import tokens from './tokens'
import forgotPassword from './forgotPassword'
import registration from './registration'

const router = express.Router()

router.use('/', auth)
router.use('/clients', clients)
router.use('/tokens', tokens)
router.use('/forgotPassword', forgotPassword)
router.use('/registration', registration)
export default router
