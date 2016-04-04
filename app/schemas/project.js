let Schema = require('mongoose').Schema
let userAdminSchema = require('./userAdmin')

let projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  desc: {
    type: String,
    maxlength: 500
  },
  avatar: {
    type: String,
    maxlength: 500
  },

  users: {
    type: [userAdminSchema],
    validate: {
      validator(arr) { return !!_.find(arr, { admin: true }) },
      message: 'You can\'t remove all admins from a project.'
    }
  },

  archieved: {
    type: Boolean,
    default: false,
    required: true
  }
})

module.exports = projectSchema
