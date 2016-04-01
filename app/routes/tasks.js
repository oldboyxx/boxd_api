let router = require('express').Router()
let { task, shared } = require('../models')

router.post('/',
  shared.getItem('board'),
  shared.validateAccess(),
  task.validateAccess,
  task.createTask
)

router.get('/:id',
  shared.getItem('task'),
  shared.getItem('board', '$.task.board_id'),
  shared.validateAccess(),
  shared.respond('omit:board')
)

router.put('/:id',
  shared.getItem('task'),
  shared.getItem('board', '$.task.board_id'),
  shared.validateAccess(),
  task.validateAccess,
  task.updateTask,
  shared.saveItem('task'),
  shared.respond('omit:board')
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
