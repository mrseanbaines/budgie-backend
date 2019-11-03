import express from 'express';
import dotenv from 'dotenv-safe';

import * as routes from './routes';

dotenv.config();

const app = express();
const { PORT } = process.env;

app.use('/foo', routes.foo);

app.listen(PORT, () => {
  console.log(`🚀 Your app is available at http://localhost:${PORT}`);
});
