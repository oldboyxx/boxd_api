let mongoose = require('mongoose')
let timestamps = require('mongoose-timestamp')

mongoose.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

if (process.env.NODE_ENV !== 'production')
  mongoose.set('debug', true)

module.exports = require('require-all')(__dirname)