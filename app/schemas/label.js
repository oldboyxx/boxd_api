let mongoose = require('mongoose')
let Schema = mongoose.Schema

let labelSchema = new Schema({
  title: {
    type: String,
    maxlength: 100,
    trim: true
  },
  color: {
    type: String,
    required: true,
    maxlength: 7,
    trim: true
  }
})

module.exports = labelSchema
