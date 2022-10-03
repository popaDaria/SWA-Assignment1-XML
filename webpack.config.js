const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: { 
    main: './src/init.js',
    forecast: './src/forecast/init.js'
  },
  mode: 'development',
  devServer: {
    static: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Weather',
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['main'],
      excludeChunks: ['forecast']

    }),
    new HtmlWebpackPlugin({
      title: 'Forecast',
      filename: 'forecast.html',
      template: 'src/forecast.html',
      chunks: ['forecast'],
      excludeChunks: ['main']
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
}