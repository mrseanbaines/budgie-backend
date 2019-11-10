/* eslint-disable import/first */
require('dotenv-safe').config();

import express from 'express';
import * as routes from './routes';
/* eslint-enable import/first */

const app = express();
const { PORT, SITE_URL } = process.env;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', SITE_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.use(express.json());

app.use('/auth', routes.auth);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Your app is available at http://localhost:${PORT}`);
});
