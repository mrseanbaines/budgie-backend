import express from 'express';
import axios from 'axios';
import { stringify } from 'querystring';

const router = express.Router();
const { MONZO_BASE_URL = '', CLIENT_SECRET = '' } = process.env;

router.get('/token', async (req, res) => {
  const body = {
    client_secret: CLIENT_SECRET,
    grant_type: req.query.grant_type,
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri,
    code: req.query.code,
  };

  const response = await axios.post(`${MONZO_BASE_URL}/oauth2/token`, stringify(body));

  res.status(200).send({ accessToken: response.data.access_token });
});

export default router;
