'use strict';

var passport = require('passport');
var router = require('express').Router();

var _require = require('../middleware/authentication');

var createJWToken = _require.createJWToken;


router.use(passport.initialize());

router.get('/google', function (req, res) {
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email'],
    state: req.query.origin
  })(req, res);
});

router.get('/google/callback', passport.authenticate('google', { session: false }), function (req, res, next) {
  var token = createJWToken(req.user);
  res.redirect(req.query.state + '?jwtoken=' + token);
});

module.exports = router;