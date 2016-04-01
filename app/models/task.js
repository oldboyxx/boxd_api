let { Task } = require('./models')

let actions = {

  validateAccess(req, res, next) {
    let id = req.body.list_id
    let valid = id ? _.find(req.$.board.lists, { _id: id }) : true
    next(valid ? null : _.$err('denied'))
  },

  createTask(req, res, next) {
    Task.create(req.body, (err, task) => {
      if (err) return next(err)
      res.json({ data: task })
    })
  },

  updateTask(req, res, next) {
    delete req.body.board_id // Protection
    req.$.task.set(req.body)
    next()
  }
}

module.exports = actions

