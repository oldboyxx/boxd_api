let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 40
  },
  email: {
    type: String,
    required: true,
    maxlength: 100,
    validate: {
      validator(v) { return /.+@.+/.test(v) },
      message: 'Please enter a valid email address.'
    }
  },
  avatar: {
    type: String,
    maxlength: 500
  },
  website: {
    type: String,
    maxlength: 100
  },
  bio: {
    type: String,
    maxlength: 500
  }
})

userSchema.index({ email: 1 }, { unique: true })

let User = mongoose.model('User', userSchema)

let $ = {

  validateAdmin(req, res, next) {
    next(req.user.isAdmin ? null : _.$err('denied'))
  },

  validateSelf(req, res, next) {
    next(req.user.id === req.params.id ? null : _.$err('denied'))
  },

  createUser(req, res, next) {
    User.create(req.body, (err, user) => {
      if (err) return next(_.$err("This email already exists.", 400))
      res.json({ data: user })
    })
  },

  getUsers(req, res, next) {
    User.find({}, (err, users) => {
      if (err) return next(err)
      res.json({ data: users })
    })
  },

  getUser(req, res, next) {
    User.findById(req.params.id, (err, user) => {
      if (err) return next(err)
      if (!user) return next(_.$err('user:null'))

      res.json({ data: user })
    })
  },

  updateUser(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body,
    { runValidators: true, new: true }, (err, user) => {

      if (err) return next(_.$err("This email already exists.", 400))
      if (!user) return next(_.$err('user:null'))
      res.json({ data: user })
    })
  }
}

module.exports = { userSchema, User, $ }
