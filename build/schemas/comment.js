'use strict';

var Schema = require('mongoose').Schema;

var commentSchema = new Schema({
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
  },
  created_at: {
    type: Date,
    required: true
  }
});

module.exports = commentSchema;