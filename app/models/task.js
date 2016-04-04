let actions = {

  validateListAccess(req, res, next) {
    if (!req.$.list) return next()
    let valid = req.$.list.board_id.toString() === req.$.board._id.toString()
    next(valid ? null : _.$err('denied'))
  },

  update(req, res, next) {
    let r = req.body

    _.each(['label', 'users'], (type) => {
      if (r['add_'+type]) {
        req.$.task[type+'s'].addToSet(r['add_'+type])
      } else if (r['remove_'+type]) {
        req.$.task[type+'s'].pull(r['remove_'+type])
      }
    })
  },

  getUserIDs(req, res, next) {
    let IDs = _.uniq(req.$.task.users.concat(_.map(req.$.task.comments, 'user')))
    req.qArgs = [{ _id: { $in: IDs }}, '-email']
    next()
  }
}

module.exports = actions

