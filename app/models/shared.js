let models = require('./models')

let actions = {

  addFirstAdmin(req, res, next) {
    req.body.users = [{ _id: req.user.id, admin: true }]
    next()
  },

  validateAdmin(req, res, next) {
    next(req.user.isAdmin ? null : _.$err('denied'))
  },

  validateAccess(admin, allowPassage) {
    return (req, res, next) => {
      let match = { _id: req.user.id }
      if (admin) _.merge(match, { admin: true })

      let obj = req.$.board || req.$.project // board must be first
      if (!obj) return next(_.$err('Validation object missing', 400))

      let valid = !!_.find(obj.users, match)

      if (allowPassage) {
        req.accessValidated = valid
        next()
      } else {
        next(valid ? null : _.$err('denied'))
      }
    }
  },

  createItem(model) {
    return (req, res, next) => {
      models[_.capitalize(model)].create(req.body, (err, item) => {
        if (err) return next(err)
        req.$[model] = item
        next()
      })
    }
  },

  getItems(model) {
    return (req, res, next) => {
      let args = req.qArgs || [{}]

      models[_.capitalize(model)].find(...args).lean().exec((err, items) => {
        if (err) return next(err)
        req.$[model+'s'] = items
        next()
      })
    }
  },

  getItem(model, idPath, notRequired) {
    return (req, res, next) => {
      let id = idPath ? _.get(req, idPath) : req.body[model+'_id']
      if (!id && notRequired) return next()

      models[_.capitalize(model)].findById(id, (err, item) => {
        if (err) return next(err)
        if (!item) return next(_.$err(model+':null'))
        req.$[model] = item
        next()
      })
    }
  },

  updateUserAdmin(model) {
    return (req, res, next) => {
      let r = req.body

      if (req.accessValidated === false) {
        if (r.remove_user) {
          r = _.pick(r, ['remove_user'])
        } else {
          next(_.$err('denied'))
        }
      }

      if (r.add_user) {
        let user = { _id: r.add_user, admin: r.admin }
        _.$upsert(req.$[model].users, { _id: r.add_user }, user)

      } else if (r.remove_user) {
        req.$[model].users.pull(r.remove_user)
      }

      next()
    }
  },

  updateItem(model, omit) {
    return (req, res, next) => {
      if (omit) req.body = _.omit(req.body, _.tail(omit.split(':')))
      req.$[model].set(req.body)
      next()
    }
  },

  saveItem(model) {
    return (req, res, next) => {
      req.$[model].save((err, item) => {
        if (err) return next(err)
        req.$[model] = item
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

