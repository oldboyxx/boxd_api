let router = require('express').Router()
let { task, shared: $ } = require('../models')

router.post('/',
  $.getItem('board'),
  $.validateAccess(),
  $.getItem('list'),
  task.validateListAccess,
  $.createItem('task'),
  $.respond('omit:board:list')
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
  $.getItem('list'),
  task.validateListAccess,
  $.updateItem('task', 'omit:board_id'),
  task.update,
  $.saveItem('task'),
  $.respond('omit:board:list')
)

/*router.delete('/:id',
  $.removeItem()
)*/

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
