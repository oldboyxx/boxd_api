// Set lodash as the ONLY global var

GLOBAL._ = require('lodash')
require('./helpers/lodash_mixins')

let mongoose = require('mongoose')
let config = require('../config')

// Configure debugging

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true)
}

// Connect to database and start app

mongoose.connect(config.dbPath, (err) => {
  if (err) throw err
  require('./app').start()
})

