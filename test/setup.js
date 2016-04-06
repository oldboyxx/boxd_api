before('connect to and reset test database', function(done) {
  mongoose.connect(config.dbPath, done)
})
