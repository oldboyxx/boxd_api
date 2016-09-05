let passport = require('passport')
let router = require('express').Router()
let faker = require('faker')
let userActions = require('../models/user')
let { createJWToken } = require('../middleware/authentication')

router.use(passport.initialize())

router.get('/google', (req, res) => {
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email'],
    state: req.query.origin
  })(req, res)
})

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    let token = createJWToken(req.user)
    res.redirect(req.query.state + '?jwtoken=' + token)
  }
)

router.get('/test', (req, res, next) => {
  let testUser = {
    email: `test.user@${_.random(0, 999999999)}.com`,
    name: faker.name.findName(),
    avatar: {
      provider: 'google',
      url: faker.internet.avatar()
    }
  }

  userActions.createUser(testUser, (err, user) => {
    if (err) return next(err)
    let token = createJWToken(user)
    res.redirect(req.query.origin + '?test=true&jwtoken=' + token)
  })
})

module.exports = router
