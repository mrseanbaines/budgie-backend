import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const { JWT_SECRET } = process.env

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).send({
        message: 'No authorisation token provided',
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    res.locals.user = decoded

    return next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send('Auth token expired')
    }

    return res.status(500).send(err)
  }
}

export default auth
