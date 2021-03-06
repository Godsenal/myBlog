var webpack = require('webpack');

module.exports = {

  entry: [
    'babel-polyfill',
    '.client/src/index.js',
    'webpack-dev-server/client?http://0.0.0.0:4000',
    'webpack/hot/only-dev-server',
  ],

  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },

  devServer: {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    historyApiFallback: true,
    contentBase: './public',
    proxy: {
      "*": "http://localhost:3000"
    },
    stats: {
          // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  },


  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules\/react-waypoint/, // add-
          /node_modules\/consolidated-events/
        ],
      },
      {
        test: /\.css$/,
        include: [/node_modules/,/style\/quill/],
        loader: 'style-loader!css-loader'
        //loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/,/style\/quill/],
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      },
      {
        test: /\.scss$/,
        use:
        [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options:
            {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options:
            {
              sourceMap: true
            }
          }]
      }
    ],
  },


};
