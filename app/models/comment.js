let Schema = require('mongoose').Schema

let commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  user: {
    type: String,
    required: true
  }
})

module.exports = { commentSchema }
