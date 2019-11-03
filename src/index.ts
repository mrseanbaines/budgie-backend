import express from 'express';
import dotenv from 'dotenv-safe';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import config from '../webpack.config.js';
import * as routes from './routes';

dotenv.config();

const app = express();
const compiler = webpack(config);
const { PORT } = process.env;

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }),
);

app.use('/foo', routes.foo);

app.listen(PORT, () => {
  console.log(`🚀 Your app is available at http://localhost:${PORT}`);
});
