let Schema = require('mongoose').Schema
let userAdminSchema = require('./userAdmin')

let obj = {
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
  }
}

let projectSchema = new Schema(obj)
let archievedProjectSchema = new Schema(obj)

module.exports = { projectSchema, archievedProjectSchema }
