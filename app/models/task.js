let { Task } = require('./models')

let actions = {

  createTask(req, res, next) {
    Board.findById(req.body.board_id).lean().exec((err, board) => {
      if (err || !board) return next(err)

      if (!_.find(board.users, { _id: req.user.id })) {
        if (!_.find(board.lists, { _id: req.body.list_id })) {
          return next(_.$err('denied'))
        }
      }

      Task.create(req.body, (err, task) => {
        if (err) return next(err)
        res.json({ data: task })
      })
    })
  },

  getTask(req, res, next) {
    Task.findById(req.params.id).lean().exec((err, task) => {
      if (err || !task) return next(err)

      Board.findById(task.board_id).lean().exec((err, board) => {
        if (err || !board) return next(err)

        if (!_.find(board.users, { _id: req.user.id })) {
          return next(_.$err('denied'))
        }

        res.json({ data: task })
      })
    })
  },

  updateTask(req, res, next) {
    let r = req.body

    Task.findById(req.params.id, (err, task) => {
      if (err || !task) return next(err)

      Board.findById(task.board_id).lean().exec((err, board) => {
        if (err || !board) return next(err)

        if (!_.find(board.users, { _id: req.user.id })) {
          if (!_.find(board.lists, { _id: r.list_id })) {
            return next(_.$err('denied'))
          }
        }

        delete r.board_id // Protection
        task.set(r)

        task.save((err, task) => {
          if (err) return next(err)
          res.json({ data: task })
        })
      })
    })
  }

}


module.exports = actions

