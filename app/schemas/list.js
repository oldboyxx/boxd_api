let Schema = require('mongoose').Schema

let listSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  position: {
    type: Number,
    required: true
  },
  board_id: {
    type: Schema.Types.ObjectId,
    required: true
  },

  archieved: {
    type: Boolean,
    default: false,
    required: true
  }
})

listSchema.index({ 'board_id': 1 })

module.exports = listSchema
