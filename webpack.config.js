const path = require('path');
const nodeExternals = require('webpack-node-externals');

const { NODE_ENV } = process.env;

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/',
  },
  watch: NODE_ENV === 'development',
  mode: NODE_ENV,
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
};
