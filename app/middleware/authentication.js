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
    callbackURL: config.host + '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    getOrCreateUser('google', profile, (err, user) => {
      done(err, user)
    })
  }
))

/**
* Create and issue JWTokens
*/

function createJWToken(req, res, next) {

  let payload = {
    userID: req.user.id,
    name: req.user.name,
    avatar: req.user.avatar
  }

  jwt.sign(payload, config.JWTSecret, {}, (token) => {
    req.JWToken = token
    next()
  })
}


























































function authenticateUser(req, res, next) {
  /*
  req.user = { id: "56ffc25e8a654b0d3126bdaf" }

  let modIDs = [
    "56ffc25e8a654b0d3126bdaf"
  ]

  req.user.isAdmin = _.includes(modIDs, req.user.id)
  */
  next()
}

module.exports = { authenticateUser, createJWToken }
