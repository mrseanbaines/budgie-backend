import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
  console.log(req.body)

  try {
    return res.status(200).send({
      status: 'success',
      message: 'Hello there!',
      data: req.body,
    })
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
