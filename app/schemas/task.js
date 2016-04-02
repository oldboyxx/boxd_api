let Schema = require('mongoose').Schema
let commentSchema = require('./comment')

let obj = {
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
}

let taskSchema = new Schema()
let archievedTaskSchema = new Schema()

taskSchema.index({ 'list_id': 1 })
archievedTaskSchema.index({ 'list_id': 1 })

module.exports = { taskSchema, archievedTaskSchema }
