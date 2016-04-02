let router = require('express').Router()
let { task, shared: $ } = require('../models')

router.post('/',
  $.getItem('board'),
  $.validateAccess(),
  task.validateAccess,
  $.createItem('task'),
  $.respond('omit:board')
)

router.get('/:id',
  $.getItem('task'),
  $.getItem('board', '$.task.board_id'),
  $.validateAccess(),
  $.respond('omit:board')
)

router.put('/:id',
  $.getItem('task'),
  $.getItem('board', '$.task.board_id'),
  $.validateAccess(),
  task.validateAccess,
  task.updateTask,
  $.saveItem('task'),
  $.respond('omit:board')
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
