let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userAdminSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true
  }
})

module.exports = { userAdminSchema }
