let models = require('./models')

let actions = {

  addFirstAdmin(req, res, next) {
    req.body.users = [{ _id: req.user.id, admin: true }]
    next()
  },

  validateAdmin(req, res, next) {
    next(req.user.isAdmin ? null : _.$err('denied'))
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

  getItem(model, idPath) {
    return (req, res, next) => {
      let id = idPath ? _.get(req, idPath) : req.body[model+'_id']
      if (!id) return next()

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

      if (r.add_user_id) {
        let user = { _id: r.add_user_id, admin: r.admin }
        _.$upsert(req.$[model].users, { _id: r.add_user_id }, user)

      } else if (r.remove_user_id) {
        req.$[model].users.pull(r.remove_user_id)
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

