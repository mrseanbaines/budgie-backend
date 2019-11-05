require('dotenv-safe').config();

// eslint-disable-next-line import/first
import express from 'express';

// eslint-disable-next-line import/first
import * as routes from './routes';

const app = express();
const { PORT, SITE_URL } = process.env;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', SITE_URL);

  next();
});

app.use('/auth', routes.auth);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Your app is available at http://localhost:${PORT}`);
});
