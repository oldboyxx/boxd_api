let mongoose = require('mongoose')
let Schema = mongoose.Schema
let { commentSchema } = require('./comment')

let schema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 500
  },
  desc: {
    type: String,
    maxlength: 10000
  },
  labels: [{
    type: String,
    maxlength: 30
  }],
  due_date: {
    type: Date
  },
  position: {
    type: Number,
    required: true
  },

  list_id: {
    type: Schema.Types.ObjectId,
    required: true
  },

  users: {
    type: [String],
    default: []
  },
  comments: {
    type: [commentSchema],
    default: []
  },

  archieved: {
    type: Boolean,
    default: false
  }
})

schema.index({ 'list_id': 1 })

let model = mongoose.model('Task', schema)

module.exports = { schema, model }
