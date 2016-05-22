describe('ALL /Protected routes', () => {
  it('should pass with token', (done) => {

    request.get('/projects')
      .set(util.token(seeds.users[0]))
      .expect(200)
      .end(done)
  })
})

describe('ALL /Protected routes', () => {
  it('should NOT pass without token', (done) => {

    request.get('/projects')
      .expect(401)
      .expect(res => {
        expect(res.body.errors[0].message).to.contain('denied:jwtoken')
      }).end(done)
  })
})

describe('ANY /Protected route', () => {
  it('should return current_user if requested', (done) => {

    request.get('/projects')
      .set(util.token(seeds.users[0]))
      .query({ get_current_user: true })
      .expect(200)
      .expect(res => {
        expect(res.body.data.current_user.email).to.be.a('string')
      }).end(done)
  })
})
