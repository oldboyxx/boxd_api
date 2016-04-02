let { User } = require('./models')

let actions = {

  createUser(req, res, next) {
    User.create(req.body, (err, user) => {
      if (err) return next(_.$err("This email already exists.", 400))
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

module.exports = actions
