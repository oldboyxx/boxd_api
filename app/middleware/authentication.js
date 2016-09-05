let passport = require('passport')
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
let jwt = require('jsonwebtoken')
let config = require('../../config')
let userActions = require('../models/user')
let { User } = require('../models/models')

/**
* Local utils
*/

function createNameFromEmail(email) {
  let str = email.split('@')[0]
  let firstName = _.upperFirst(str.split('.')[0])
  let lastName = _.upperFirst(str.split('.')[1])
  return lastName ? `${firstName} ${lastName}` : firstName
}

function getEmail(type, userData) {
  if (type === 'google') {
    return _.find(userData.emails, { type: 'account' }).value
  }
}

function buildUserObject(type, userData) {
  let email = getEmail(type, userData)
  if (type === 'google') {
    return {
      name: userData.displayName || createNameFromEmail(email),
      email: email,
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
      let userObject = buildUserObject(type, userData)
      userActions.createUser(userObject, callback)
    }
  })
}

/**
* Define passport strategies
*/

passport.use(new GoogleStrategy({
    clientID: config.googleOAuthClientID,
    clientSecret: config.googleOAuthSecret,
    callbackURL: config.appURL + '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    getOrCreateUser('google', profile, done)
  }
))

/**
* Create, validate JWTokens and set current user
*/

function createJWToken(user) {
  let payload = _.pick(user, ['id', 'email'])
  return jwt.sign(payload, config.JWTSecret, { expiresIn: '30d' })
}

function validateTokenAndSetUser(req, res, next) {
  let token = req.headers['x-jwtoken']
  if (!token) return next(_.$err('denied:jwtoken:missing', 401))

  jwt.verify(token, config.JWTSecret, (err, userData) => {
    if (err) return next(_.$err('denied:jwtoken:invalid', 401))
    req.user = userData
    req.user.isAdmin = _.includes(config.adminEmails.split(' '), req.user.email)
    next()
  })
}

function returnCurrentUser(req, res, next) {
  if (!req.query.get_current_user) return next()

  User.findById(req.user.id, (err, user) => {
    if (err) return next(err)
    if (!user) return next(_.$err('denied:jwtoken:userNotFound', 401))
    req.$.current_user = user
    next()
  })
}

module.exports = {
  createJWToken,
  validateTokenAndSetUser,
  returnCurrentUser
}
