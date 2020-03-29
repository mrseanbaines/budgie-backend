import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const { JWT_SECRET } = process.env

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('x-auth-token')

    if (!token) {
      return res.status(401).json('No authorisation token provided')
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    res.locals.user = decoded

    return next()
  } catch (err) {
    return res.status(500).send(err)
  }
}

export default auth
