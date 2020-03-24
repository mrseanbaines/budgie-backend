import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    return res.status(200).send({
      status: 'success',
      message: 'Hello there!',
    })
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
