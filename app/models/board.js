let { Board, Project, User, Task } = require('./models')

let actions = {

  createBoard(req, res, next) {
    req.body.users = [{ _id: req.user.id, admin: true }]
    req.body.lists = [] // Protection

    Board.create(req.body, (err, board) => {
      if (err) return next(err)
      res.json({ data: board })
    })
  },

  getTasks(req, res, next) {
    Task.find({ board_id: req.$.board._id }, '-desc -comments').lean().exec((err, tasks) => {
      if (err) return next(err)
      req.$.tasks = tasks
      next()
    })
  },

  getUsers(req, res, next) {
    let taskUserIDs = _.flatMap(req.$.tasks, (t) => { return t.users })
    let boardUserIDs = _.map(req.$.board.users, (u) => { return u._id })
    let userIDs = _.uniq(taskUserIDs.concat(boardUserIDs))

    User.find({ _id: { $in: userIDs }}, '-email').lean().exec((err, users) => {
      if (err) return next(err)
      req.$.users = users
      next()
    })
  },

  updateBoard(req, res, next) {
    let r = req.body

    delete r.users // Protection
    delete r.lists // Protection
    delete r.project_id // Protection
    req.$.board.set(r)

    if (r.add_user_id) {
      let user = { _id: r.add_user_id, admin: r.admin }
      _.$upsert(req.$.board.users, { _id: r.add_user_id }, user)

    } else if (r.remove_user_id) {
      req.$.board.users.pull(r.remove_user_id)
    }

    next()
  }
}

module.exports = actions
