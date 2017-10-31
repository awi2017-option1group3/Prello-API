import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import oAuthServer from 'node-oauth2-server'
import path from 'path'
import authRouter from './auth/routes/index'
import apiRouter from './api/routes/index'
import registerRouter from './api/routes/register'
import authService from './auth/services/auth'

const app = express()
const port = process.env.PORT || 8000
const db = process.env.MONGODB_URI || 'mongodb://localhost/prello'

mongoose.Promise = global.Promise
mongoose.connect(db, { useMongoClient: true })

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Auth
app.oauth = oAuthServer({
  model: authService,
  grants: authService.authorizedGrants,
  debug: true,
})
app.set('views', path.join(__dirname, 'auth/views'))
app.set('view engine', 'pug')
app.use(app.oauth.errorHandler())
app.use('/auth', authRouter)

// API
app.use('/register', registerRouter)
app.use('/api', app.oauth.authorise(), apiRouter)

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
