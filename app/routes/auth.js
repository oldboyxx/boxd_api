let passport = require('passport')
let router = require('express').Router()
let { user, shared: $ } = require('../models')
let { createJWToken } = require('../middleware/authentication')

router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  createJWToken
  (req, res) => {
    res.json({ data: req.user })
  }
)

module.exports = router
