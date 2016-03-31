let mongoose = require('mongoose')
let Schema = mongoose.Schema
let { commentSchema } = require('./comment')

let taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 500
  },
  desc: {
    type: String,
    maxlength: 10000
  },
  labels: {
    type: [String],
    default: []
  },
  due_date: {
    type: Date
  },
  position: {
    type: Number,
    required: true
  },

  board_id: {
    type: Schema.Types.ObjectId,
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
  comments_count: {
    type: Number,
    default: 0
  }
})

taskSchema.index({ 'list_id': 1 })

let Task = mongoose.model('Task', taskSchema)

module.exports = { taskSchema, Task }
