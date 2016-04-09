let passport = require('passport')
let router = require('express').Router()
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
    res.redirect('http://' + req.query.state + '?jwtoken=' + token)
  }
)

module.exports = router
