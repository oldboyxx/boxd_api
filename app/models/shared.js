let models = require('./models')

let actions = {

  validateAdmin(req, res, next) {
    next(req.user.isAdmin ? null : _.$err('denied'))
  },

  validateSelf(req, res, next) {
    next(req.user.id === req.body.user_id ? null : _.$err('denied'))
  },

  validateAccess(admin) {
    return (req, res, next) => {
      let match = { _id: req.user.id }
      if (admin) _.merge(match, { admin: true })

      let obj = req.$.project || req.$.board

      let valid = _.find(obj.users, match)
      next(valid ? null : _.$err('denied'))
    }
  },

  getItem(name, idPath) {
    return (req, res, next) => {
      let id = idPath ? _.get(req, idPath) : req.body[name+'_id']

      models[_.capitalize(name)].findById(id, (err, item) => {
        if (err) return next(err)
        if (!item) return next(_.$err(name+':null'))
        req.$[name] = item
        next()
      })
    }
  },

  saveItem(name) {
    return (req, res, next) => {
      req.$[name].save((err, item) => {
        if (err) return next(err)
        req.$[name] = item
        next()
      })
    }
  },

  respond(omit) {
    return (req, res, next) => {
      if (omit) req.$ = _.omit(req.$, _.tail(omit.split(':')))
      res.json({ data: req.$ })
    }
  }
}


module.exports = actions

