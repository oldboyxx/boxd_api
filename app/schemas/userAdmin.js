let Schema = require('mongoose').Schema

let userAdminSchema = new Schema({
  _id: {
    type: String,
    required: true,
    trim: true
  },
  admin: {
    type: Boolean,
    required: true
  }
})

userAdminSchema.index({ '_id': 1 })

module.exports = userAdminSchema
