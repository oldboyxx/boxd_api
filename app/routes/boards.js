let router = require('express').Router()
let { board, shared: $ } = require('../models')

router.post('/',
  $.getItem('project'),
  $.validateAccess(),
  $.addFirstAdmin,
  $.createItem('board'),
  $.respond('omit:project')
)

router.get('/:id',
  $.getItem('board'),
  $.validateAccess(),
  board.setQueryArgs('lists'), $.getItems('list'),
  board.setQueryArgs('tasks'), $.getItems('task'),
  board.setQueryArgs('users'), $.getItems('user'),
  $.respond()
)

router.put('/:id',
  $.getItem('board'),
  $.validateAccess('admin'),
  $.updateItem('board', 'omit:users:project_id'),
  $.updateUserAdmin('board'),
  $.saveItem('board'),
  $.respond()
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
