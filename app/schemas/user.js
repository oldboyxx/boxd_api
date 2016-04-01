let Schema = require('mongoose').Schema

let userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 40
  },
  email: {
    type: String,
    required: true,
    maxlength: 100,
    validate: {
      validator(v) { return /.+@.+/.test(v) },
      message: 'Please enter a valid email address.'
    }
  },
  avatar: {
    type: String,
    maxlength: 500
  },
  website: {
    type: String,
    maxlength: 100
  },
  bio: {
    type: String,
    maxlength: 500
  }
})

userSchema.index({ email: 1 }, { unique: true })

module.exports = userSchema
