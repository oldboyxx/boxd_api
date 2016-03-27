let mongoose = require('mongoose')
let Schema = mongoose.Schema

let schema = new Schema({
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

schema.index({ email: 1 })

let model = mongoose.model('User', schema)

module.exports = { schema, model }
