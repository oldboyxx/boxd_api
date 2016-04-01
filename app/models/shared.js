let models = require('./models')

let actions = {

  validateAdmin(req, res, next) {
    next(req.user.isAdmin ? null : _.$err('denied'))
  },

  validateSelf(req, res, next) {
    next(req.user.id === req.body.user_id ? null : _.$err('denied'))
  },

  validateAccess(req, res, next, admin) {
    let match = { _id: req.user.id }
    if (admin) _.merge(match, { admin: true })

    let obj = req.project || req.board

    let valid = _.find(obj.users, match)
    next(valid ? null : _.$err('denied'))
  },

  getItem(req, res, next, name) {
    models[_.capitalize(name)].findById(req.body[name+'_id'], (err, item) => {
      if (err) return next(err)
      if (!item) return next(_.$err(name+':null'))
      req.$[name] = item
      next()
    })
  },

  respond(req, res) {
    res.json({ data: req.$ })
  }
}


module.exports = actions

