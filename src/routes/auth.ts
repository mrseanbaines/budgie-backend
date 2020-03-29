import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user'

const router = express.Router()
const { JWT_SECRET } = process.env

// Authenticate User
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).send('One or more required fields missing')
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).send('User not found')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(400).send('Invalid password')
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 3600 })

    return res.send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
