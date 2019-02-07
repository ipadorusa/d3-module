const path = require('path');

module.exports = {
  entry: __dirname + '/ui.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ui.bundle.js'
  }
};