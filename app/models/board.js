let mongoose = require('mongoose')
let Schema = mongoose.Schema
let { listSchema } = require('./list')
let { userAdminSchema } = require('./_shared')

let boardSchema = new Schema({
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
      validator(arr) { return !!_.find(arr, { admin: true }) },
      message: 'You can\'t remove all admins from a board.'
    }
  },
  lists: {
    type: [listSchema],
    default: []
  }
})

boardSchema.index({ 'project_id': 1 })

let Board = mongoose.model('Board', boardSchema)

module.exports = { boardSchema, Board }
