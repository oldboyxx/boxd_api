let mongoose = require('mongoose')
let { dropDatabase, batchInsert } = require('../tasks/seed_db_script')

before('connect to and seed test database', (done) => {
  mongoose.connect(config.dbPath, (err) => {
    dropDatabase()

    batchInsert({ batchSize: 5, log: true }, (err, items) => {
      if (err) return done(err)
      global.seeds = items
      console.log("Database seeding done.\n")
      done()
    })
  })
})
