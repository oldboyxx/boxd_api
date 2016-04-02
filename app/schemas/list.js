let Schema = require('mongoose').Schema

let obj = {
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  position: {
    type: Number,
    required: true
  },
  board_id: {
    type: Schema.Types.ObjectId,
    required: true
  }
}

let listSchema = new Schema(obj)
let archievedListSchema = new Schema(obj)

listSchema.index({ 'board_id': 1 })
archievedListSchema.index({ 'board_id': 1 })

module.exports = { listSchema, archievedListSchema }
