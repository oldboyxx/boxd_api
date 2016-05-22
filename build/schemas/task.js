'use strict';

var Schema = require('mongoose').Schema;
var commentSchema = require('./comment');

var taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  desc: {
    type: String,
    maxlength: 500000,
    trim: true
  },
  has_desc: {
    type: Boolean
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
  },

  archieved: {
    type: Boolean,
    default: false,
    required: true
  }
});

taskSchema.pre('save', function (next) {
  this.has_desc = !!this.desc;
  next();
});

taskSchema.index({ list_id: 1 });
taskSchema.index({ title: 'text' });

module.exports = taskSchema;