import dotenv from 'dotenv-safe'
import express from 'express'
import mongoose from 'mongoose'

import * as routes from './routes'

dotenv.config()
const app = express()
const { PORT, SITE_URL, DATABASE } = process.env

const connectDatabase = async () => {
  try {
    await mongoose.connect(DATABASE, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
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

  next()
})

app.use(express.json())

app.use('/auth', routes.auth)
app.use('/categories', routes.categories)
app.use('/transactions', routes.transactions)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Your app is available at http://localhost:${PORT}`)
})
