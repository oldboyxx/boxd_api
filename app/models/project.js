let { Board, User } = require('./models')

let actions = {

  setQueryArgs(name) {
    return (req, res, next) => {

      if (name === 'projects') {
        let archieved = !!req.query.archieved_projects
        req.qArgs = [{ 'users._id': req.user.id, archieved }, 'title avatar archieved']

      } else if (/boards/.test(name)) {
        let isHome = name !== 'boards'
        let archieved = isHome ? false : !!req.query.archieved_boards
        let sel = isHome ? { $in: _.map(req.$.projects, '_id') } : req.$.project._id

        req.qArgs = [{ project_id: sel, 'users._id': req.user.id, archieved }, 'title background project_id archieved']

      } else if (name === 'users') {
        req.qArgs = [{ _id: { $in: _.map(req.$.project.users, '_id') }}, '-email -created_at -updated_at']
      }
      next()
    }
  },

  removeUserFromBoards(req, res, next) {
    let r = req.body
    if (!r.remove_user) return next()

    let sel = { project_id: req.$.project._id, 'users._id': r.remove_user }
    let cmd = { $pull: { users: { _id: r.remove_user }}}

    Board.update(sel, cmd, { multi: true }, next)
  },

  addUser(req, res, next) {
    if (!req.body.add_user_email) return next()
    User.findOne({ email: req.body.add_user_email }, (err, user) => {
      if (err) return next(err)
      if (!user) return next(_.$err("User account with this email doesn't exist.", 404))
      req.body = { add_user: user.id, admin: false }
      req.$.added_user = user
      next()
    })
  }
}

module.exports = actions
