let Schema = require('mongoose').Schema
let userAdminSchema = require('./userAdmin')

let projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  desc: {
    type: String,
    maxlength: 500,
    trim: true
  },
  avatar: {
    type: String,
    maxlength: 500,
    trim: true
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
