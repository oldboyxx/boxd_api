let router = require('express').Router()
let { task } = require('../models')

router.post('/',
  task.createTask
)

router.get('/:id',
  task.getTask
)

router.put('/:id',
  task.updateTask
)


/*router.delete('/:id', (req, res, next) => {
  Board.findById(req.body.board_id).lean().exec((err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id })) {
      return next(_.$err('denied'))
    }

    Task.remove({ _id: req.params.id }, (err, task) => {
      if (err) return next(err)
      res.json({ data: task })
    })
  })
})*/

module.exports = router
