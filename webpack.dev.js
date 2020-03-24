const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const WebpackShellPlugin = require('webpack-shell-plugin')
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  watch: true,
  plugins: [
    new CleanTerminalPlugin(),
    new WebpackShellPlugin({
      onBuildEnd: ['yarn nodemon'],
    }),
  ],
})
