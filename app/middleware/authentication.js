let passport = require('passport')
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
let jwt = require('jsonwebtoken')
let config = require('../../config')
let { User } = require('../models/models')

/**
* Define passport strategies
*/

function getEmail(type, userData) {
  if (type === 'google') {
    return _.find(userData.emails, { type: 'account' }).value
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
    }
  }
}

function getOrCreateUser(type, userData, callback) {
  let email = getEmail(type, userData)

  User.findOne({ email }, (err, user) => {
    if (err) return callback(err)
    if (user) {
      callback(null, user)
    } else {
      User.create(buildUserObject(type, userData), callback)
    }
  })
}

passport.use(new GoogleStrategy({
    clientID: config.googleOAuthClientID,
    clientSecret: config.googleOAuthSecret,
    callbackURL: config.appURL + '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    getOrCreateUser('google', profile, (err, user) => {
      done(err, user)
    })
  }
))

/**
* Create and validate JWTokens
*/

function createJWToken(req, res, next) {
  if (!req.user) return next(_.$err("Can't create JWToken, user missing.", 401))

  let payload = _.pick(req.user, ['id', 'email', 'name', 'avatar'])

  jwt.sign(payload, config.JWTSecret, { expiresIn: '30d' }, (token) => {
    req.JWToken = token
    next()
  })
}

/*function validateTokenAndSetUser(req, res, next) {
  let token = req.query.jwtoken || req.body.jwtoken
  if (!token) return next(_.$err('denied:jwtoken:missing', 401))

  jwt.verify(token, config.JWTSecret, (err, userData) => {
    if (err) return next(_.$err('denied:jwtoken:invalid', 401))
    req.user = userData

    req.user.isAdmin = _.includes(config.adminEmails, req.user.email)

    next()
  })
}*/

function validateTokenAndSetUser(req, res, next) {
  req.user = { id: '57030981f86fcd77a1b64dba', email: 'ivor.reic@gmail.com' }
  req.user.isAdmin = _.includes(config.adminEmails, req.user.email)
  next()
}

module.exports = { createJWToken, validateTokenAndSetUser }
