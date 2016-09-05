'use strict';

var passport = require('passport');
var router = require('express').Router();
var faker = require('faker');
var userActions = require('../models/user');

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

router.get('/test', function (req, res, next) {
  var testUser = {
    email: 'test.user@' + _.random(0, 999999999) + '.com',
    name: faker.name.findName(),
    avatar: {
      provider: 'google',
      url: faker.internet.avatar()
    }
  };

  userActions.createUser(testUser, function (err, user) {
    if (err) return next(err);
    var token = createJWToken(user);
    res.redirect(req.query.origin + '?test=true&jwtoken=' + token);
  });
});

module.exports = router;