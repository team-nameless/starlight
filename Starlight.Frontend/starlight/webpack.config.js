
// ...existing code...
module.exports = {
  // ...existing code...
  module: {
    rules: [
      // ...existing rules...
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules\/@atlaskit\/analytics-next/
      }
    ]
  },
  // ...existing code...
};
// ...existing code...