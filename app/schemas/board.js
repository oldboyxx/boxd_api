let Schema = require('mongoose').Schema
let userAdminSchema = require('./userAdmin')
let labelSchema = require('./label')

let boardSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  background: {
    type: String,
    maxlength: 500,
    trim: true
  },
  labels: {
    type: [labelSchema],
    default: []
  },

  project_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  users: {
    type: [userAdminSchema],
    validate: {
      validator(arr) { return !!_.find(arr, { admin: true }) },
      message: 'You can\'t remove all admins from a board.'
    }
  },

  archieved: {
    type: Boolean,
    default: false,
    required: true
  }
})

boardSchema.index({ 'project_id': 1 })

module.exports = boardSchema
