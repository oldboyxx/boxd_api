let mongoose = require('mongoose')
let Schema = mongoose.Schema
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
    default: [
      { _id: mongoose.Types.ObjectId(), title: 'Finished', color: '#5DB94F' },
      { _id: mongoose.Types.ObjectId(), title: 'Due soon', color: '#F3D300' },
      { _id: mongoose.Types.ObjectId(), title: 'Late', color: '#FFAB49' },
      { _id: mongoose.Types.ObjectId(), title: 'Bug', color: '#ED5F45' },
      { _id: mongoose.Types.ObjectId(), title: 'Frozen', color: '#C57EE0' },
      { _id: mongoose.Types.ObjectId(), title: 'Current', color: '#007BBF' }
    ]
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
