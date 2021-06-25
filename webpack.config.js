const path = require('path');

module.exports = {
  entry: './src/display_towers_entry.js',
  output: {
    filename: 'display_towers.js',
    path: path.resolve(__dirname, 'dist'),
  },
};