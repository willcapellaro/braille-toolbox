const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets', noErrorOnMissing: true },
        { from: 'public', to: '.', globOptions: { ignore: ['**/index.html'] }, noErrorOnMissing: true }
      ],
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    open: true,
    hot: true,
  },
};