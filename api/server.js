import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import router from './routes/index'

const app = express()
const port = process.env.PORT || 8000
const db = process.env.MONGODB_URI || 'mongodb://localhost/prello'

mongoose.Promise = global.Promise
mongoose.connect(db, { useMongoClient: true })

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH, OPTIONS')
  next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', router)

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
