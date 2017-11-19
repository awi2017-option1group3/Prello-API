import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import oAuthServer from 'node-oauth2-server'
import path from 'path'
import socketio from 'socket.io'
import redis from 'redis'

import {} from './envLoader'
import authRouter from './auth/routes/index'
import apiRouter from './api/routes/index'
import registerRouter from './api/routes/register'
import websockets from './websockets'
import authService from './auth/services/auth'

const app = express()
const server = http.Server(app)
const io = socketio(server)
const port = process.env.PORT || 8000
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/prello'
const redisClient = redis.createClient(process.env.REDIS_URL) // If no env var, use the default local config

mongoose.Promise = global.Promise
mongoose.connect(mongoDB, { useMongoClient: true })

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// oAuth
app.oauth = oAuthServer({
  model: authService,
  grants: authService.authorizedGrants,
})
app.set('views', path.join(__dirname, 'auth/views'))
app.set('view engine', 'pug')
app.use(app.oauth.errorHandler())
app.use('/auth', authRouter)

// API
app.use('/register', registerRouter)
app.use('/api', app.oauth.authorise(), apiRouter)

// Listening HTTP calls
server.listen(port, () => {
  console.log(`API listening on port ${port}`)
})

// Listening Websockets for real-time
io.on('connection', websockets(io, redisClient))
