import express from 'express'
import axios from 'axios'
import { stringify } from 'querystring'
import uuidv4 from 'uuid/v4'

const router = express.Router()
const {
  MONZO_BASE_URL = '',
  MONZO_AUTH_URL = '',
  CLIENT_SECRET = '',
  CLIENT_ID = '',
  SITE_URL = '',
  REDIRECT_URI = '',
} = process.env

const uuid = uuidv4()

router.get('/login', (req, res) => {
  res.redirect(
    `${MONZO_AUTH_URL}?${stringify({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      state: uuid,
    })}`,
  )
})

router.get('/callback', async (req, res) => {
  const { code, state } = req.query

  if (state !== uuid) {
    return res.end()
  }

  const body = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code,
  }

  const response = await axios.post(`${MONZO_BASE_URL}/oauth2/token`, stringify(body))

  return res.redirect(`${SITE_URL}?access_token=${response.data.access_token}`)
})

export default router
