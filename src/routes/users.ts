import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user'

const router = express.Router()
const { JWT_SECRET } = process.env

// Register User
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).send('One or more required fields missing')
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).send('A user with that email already exists')
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await User.create({ name, email, password: hashedPassword })
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 86400 })

    return res.status(200).send({
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
