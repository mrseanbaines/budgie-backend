import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user'
import auth from '../middleware/auth'

const router = express.Router()
const { JWT_SECRET } = process.env

// Authenticate User
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email) {
      return res.status(400).send({
        token: null,
        user: null,
        error: 'Please enter an email address',
      })
    }

    if (!password) {
      return res.status(400).send({
        token: null,
        user: null,
        error: 'Please enter a password',
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).send({
        token: null,
        user: null,
        error: 'No user with this email address was found',
      })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(400).send({
        token: null,
        user: null,
        error: 'Invalid password',
      })
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 3600 })

    res.cookie('access_token', token)

    return res.send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      error: null,
    })
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Get User
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(res.locals.user.id)

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
