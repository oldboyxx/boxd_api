let { User } = require('./models')
let createOnboardingProject = require('../utils/createOnboardingProject')

let actions = {

  createUser(userObject, callback) {
    User.create(userObject, (err, user) => {
      if (err) return callback(err)
      createOnboardingProject(user.id, () => {
        callback(null, user)
      })
    })
  }
}

module.exports = actions
