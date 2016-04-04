let mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production')
  mongoose.set('debug', true)

module.exports = require('require-all')(__dirname)