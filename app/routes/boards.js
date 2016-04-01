let router = require('express').Router()
let { board, shared } = require('../models')

router.post('/',
  board.createBoard
)

router.get('/:id',
  board.getBoard,
  shared.validateAccess,
  board.getTasks,
  board.getUsers,
  board.returnBoardTasksUsers
)

router.put('/:id',
  board.updateBoard
)


/*
router.delete('/:id', (req, res, next) => {
  Board.findById(req.params.id, (err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id, admin: true })) {
      return next(_.$err('denied'))
    }

    board.remove((err, board) => {
      if (err) return next(err)

      Task.remove({ board_id: board._id }, (err, tasks) => {
        if (err) return next(err)
        res.json({ data: board })
      })
    })
  })
})
*/
module.exports = router
