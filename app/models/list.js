
let actions = {

  createList(req, res, next) {
    Board.findById(req.body.board_id, (err, board) => {
      if (err || !board) return next(err)

      if (!_.find(board.users, { _id: req.user.id })) {
        return next(_.$err('denied'))
      }

      let list = board.lists.create({
        title: req.body.title,
        position: req.body.position
      })

      board.lists.push(list)

      board.save((err, board) => {
        if (err) return next(err)
        res.json({ data: list })
      })
    })
  },

  updateList(req, res, next) {
    Board.findById(req.body.board_id, (err, board) => {
      if (err || !board) return next(err)

      if (!_.find(board.users, { _id: req.user.id })) {
        return next(_.$err('denied'))
      }

      let list = board.lists.id(req.params.id)
      if (!list) return next()
      list.set(req.body)

      board.save((err, board) => {
        if (err) return next(err)
        res.json({ data: list })
      })
    })
  }

}


module.exports = actions

