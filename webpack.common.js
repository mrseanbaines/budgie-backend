const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/',
  },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
  },
}
