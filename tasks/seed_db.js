GLOBAL._ = require('lodash')
require('../app/helpers/lodash_mixins')

let mongoose = require('mongoose')
let config = require('../config')
let { dropDatabase, batchInsert } = require('./seed_db_script')

mongoose.connect(config.dbPath, (err) => {
  dropDatabase()

  batchInsert({ batchSize: 4, multiplier: 8 }, (err, items) => {
    if (err) return done(err)
    console.log("Database seeding done.\n")
  })
})
