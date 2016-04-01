let { Board, Project, User, Task } = require('./models')

let actions = {

  createBoard(req, res, next) {
    Project.findById(req.body.project_id).lean().exec((err, project) => {
      if (err || !project) return next(err)

      if (!_.find(project.users, { _id: req.user.id })) {
        return next(_.$err('denied'))
      }

      req.body.users = [{ _id: req.user.id, admin: true }]
      req.body.lists = [] // Protection

      Board.create(req.body, (err, board) => {
        if (err) return next(err)
        res.json({ data: board })
      })
    })
  },

  getBoard(req, res, next) {
    Board.findById(req.params.id, (err, board) => {
      if (err) return next(err)
      if (!board) return next(_.$err('board:null'))
      req.board = board
      next()
    })
  },

  getTasks(req, res, next) {
    Task.find({ board_id: req.board._id }, '-desc -comments').lean().exec((err, tasks) => {
      if (err) return next(err)
      req.tasks = tasks
      next()
    })
  },

  getUsers(req, res, next) {
    let taskUserIDs = _.flatMap(req.tasks, (t) => { return t.users })
    let boardUserIDs = _.map(req.board.users, (u) => { return u._id })
    let userIDs = _.uniq(taskUserIDs.concat(boardUserIDs))

    User.find({ _id: { $in: userIDs }}, '-email').lean().exec((err, users) => {
      if (err) return next(err)
      req.users = users
      next()
    })
  },

  returnBoardTasksUsers(req, res, next) {
    res.json({ data: { board: req.board, tasks: req.tasks, users: req.users }})
  },

  updateBoard(req, res, next) {
    let r = req.body

    Board.findById(req.params.id, (err, board) => {
      if (err || !board) return next(err)

      if (!_.find(board.users, { _id: req.user.id, admin: true })) {
        return next(_.$err('denied'))
      }

      delete r.users // Protection
      delete r.lists // Protection
      delete r.project_id // Protection
      board.set(r)

      if (r.add_user_id) {
        let user = { _id: r.add_user_id, admin: r.admin }
        _.$upsert(board.users, { _id: r.add_user_id }, user)

      } else if (r.remove_user_id) {
        board.users.pull(r.remove_user_id)
      }

      board.save((err, board) => {
        if (err) return next(err)
        res.json({ data: board })
      })
    })
  }



}


module.exports = actions
