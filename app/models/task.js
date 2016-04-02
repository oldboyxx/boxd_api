let actions = {

  validateAccess(req, res, next) {
    let valid = req.$.board.lists.id(req.body.list_id)
    console.log(valid)
    next(valid ? null : _.$err('denied'))
  },

  updateTask(req, res, next) {
    delete req.body.board_id // Protection
    req.$.task.set(req.body)
    next()
  }
}

module.exports = actions

