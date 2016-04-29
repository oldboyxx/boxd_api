let Schema = require('mongoose').Schema

let commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    maxlength: 10000,
    trim: true
  },
  user: {
    type: String,
    required: true,
    trim: true
  }
})

module.exports = commentSchema
