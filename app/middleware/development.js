let { createJWToken } = require('./authentication')
let { User, Project } = require('../models/models')

function becomeDevUser(req, res, next) {
  if (process.env.NODE_ENV !== 'development' || !req.query.become_dev_user) return next()

  Project.findOne({ archieved: false }, (err, project) => {
    if (!project) return next(_.$err('Database contains no projects', 404))
    let id = _.find(project.users, { admin: true })._id

    User.findById(id, (err, user) => {
      req.headers['x-jwtoken'] = createJWToken({ id, email: user.email })
      return next()
    })
  })
}

module.exports = { becomeDevUser }