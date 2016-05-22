'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var jwt = require('jsonwebtoken');
var config = require('../../config');

var _require = require('../models/models');

var User = _require.User;

/**
* Define passport strategies
*/

function getEmail(type, userData) {
  if (type === 'google') {
    return _.find(userData.emails, { type: 'account' }).value;
  }
}

function buildUserObject(type, userData) {
  if (type === 'google') {
    return {
      name: userData.displayName,
      email: getEmail(type, userData),
      avatar: {
        provider: type,
        url: userData.photos[0].value
      }
    };
  }
}

function getOrCreateUser(type, userData, callback) {
  var email = getEmail(type, userData);

  User.findOne({ email: email }, function (err, user) {
    if (err) return callback(err);
    if (user) {
      callback(null, user);
    } else {
      User.create(buildUserObject(type, userData), callback);
    }
  });
}

passport.use(new GoogleStrategy({
  clientID: config.googleOAuthClientID,
  clientSecret: config.googleOAuthSecret,
  callbackURL: config.appURL + '/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
  getOrCreateUser('google', profile, function (err, user) {
    done(err, user);
  });
}));

/**
* Create, validate JWTokens and set current user
*/

function createJWToken(user) {
  var payload = _.pick(user, ['id', 'email']);
  return jwt.sign(payload, config.JWTSecret, { expiresIn: '30d' });
}

function validateTokenAndSetUser(req, res, next) {
  var token = req.headers['x-jwtoken'];
  if (!token) return next(_.$err('denied:jwtoken:missing', 401));

  jwt.verify(token, config.JWTSecret, function (err, userData) {
    if (err) return next(_.$err('denied:jwtoken:invalid', 401));
    req.user = userData;
    req.user.isAdmin = _.includes(config.adminEmails.split(' '), req.user.email);
    next();
  });
}

function returnCurrentUser(req, res, next) {
  if (!req.query.get_current_user) return next();

  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    if (!user) return next(_.$err('denied:jwtoken:userNotFound', 401));
    req.$.current_user = user;
    next();
  });
}

module.exports = {
  createJWToken: createJWToken,
  validateTokenAndSetUser: validateTokenAndSetUser,
  returnCurrentUser: returnCurrentUser
};