let mongoose = require('mongoose')
let Schema = mongoose.Schema
let { userAdminSchema } = require('./_shared')
let { listSchema } = require('./list')

let schema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  background: {
    type: String,
    maxlength: 500
  },

  project_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  users: {
    type: [userAdminSchema],
    validate: {
      validator(arr) { return !!arr.length },
      message: 'You can\'t remove all users from a board.'
    }
  },

  lists: {
    type: [listSchema],
    default: []
  },

  archieved: {
    type: Boolean,
    default: false
  }
})

schema.index({ 'project_id': 1 })
schema.index({ 'users._id': 1 })

let model = mongoose.model('Board', schema)

module.exports = { schema, model }
