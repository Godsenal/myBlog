module.exports = {
  entry: './client/src/index.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style-loader!css-loader'
        //loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      },
    ],
  }
};
