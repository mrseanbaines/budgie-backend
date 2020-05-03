import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import * as routes from './routes'

const app = express()
const { PORT = 80, SITE_URL, MONGODB_URI } = process.env

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    // eslint-disable-next-line no-console
    console.log('Database connnection successful!')
  } catch (err) {
    console.error(err)
  }
}

connectDatabase()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', SITE_URL)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  next()
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/auth', routes.auth)
app.use('/categories', routes.categories)
app.use('/transactions', routes.transactions)
app.use('/users', routes.users)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Your app is available at http://localhost:${PORT}`)
})
