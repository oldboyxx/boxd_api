let actions = {

  prepForCreate(req, res, next) {
    req.body.users = [{ _id: req.user.id, admin: true }]
    req.body.lists = [] // Protection
    next()
  },

  setQueryArgs(name) {
    return (req, res, next) => {
      if (name === 'tasks') {
        req.qArgs = [{ board_id: req.$.board._id }, '-desc -comments']
      } else if (name === 'users') {
        let IDs = _.uniq(_.flatMap(req.$.tasks, 'users').concat(_.map(req.$.board.users, '_id')))
        req.qArgs = [{ _id: { $in: IDs }}, '-email']
      }
      next()
    }
  },

  updateBoard(req, res, next) {
    let r = req.body
    delete r.users // Protection
    delete r.lists // Protection
    delete r.project_id // Protection
    req.$.board.set(r)
    next()
  }
}

module.exports = actions
