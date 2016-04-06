describe('GET /users', function() {
  it('should return users successfully', function(done) {
    request
      .get('/users')
      .expect(200)
      .expect(function(res) {
        console.log(res.body.data.users)
      }).end(done)
  })
})

describe('GET /users', function() {
  it('should return users successfully', function(done) {
    request
      .get('/users')
      .expect(200)
      .expect(function(res) {
        console.log(res.body.data.users)
      }).end(done)
  })
})

describe('GET /users', function() {
  it('should return users successfully', function(done) {
    request
      .get('/users')
      .expect(200)
      .expect(function(res) {
        console.log(res.body.data.users)
      }).end(done)
  })
})