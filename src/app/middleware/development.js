let config = require('../../config')
let { createJWToken } = require('./authentication')
let { User, Project } = require('../models/models')

function becomeDevUser(req, res, next) {
  if (process.env.NODE_ENV !== 'development' || !req.query.become_dev_user) return next()

  User.find({ email: config.devEmail }, (err, users) => {
    req.headers['x-jwtoken'] = createJWToken(users[0])
    return next()
  })
}

module.exports = { becomeDevUser }
