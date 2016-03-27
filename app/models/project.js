let mongoose = require('mongoose')
let Schema = mongoose.Schema
let { userAdminSchema } = require('./_shared')

let schema = new Schema({
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
      validator(arr) { return !!arr.length },
      message: 'You can\'t remove all users from a project.'
    }
  },

  archieved: {
    type: Boolean,
    default: false
  }
})

schema.index({ 'users._id': 1 })

let model = mongoose.model('Project', schema)

module.exports = { schema, model }
