let router = require('express').Router()
let { project, shared: $ } = require('../models')

router.post('/',
  $.addFirstAdmin,
  $.createItem('project'),
  $.respond()
)

router.get('/',
  project.setQueryArgs('projects'), $.getItems('project'),
  project.setQueryArgs('homeboards'), $.getItems('board'),
  $.respond()
)

router.get('/:id',
  $.getItem('project'),
  $.validateAccess(),
  project.setQueryArgs('boards'), $.getItems('board'),
  project.setQueryArgs('users'), $.getItems('user'),
  $.respond()
)

router.put('/:id',
  $.getItem('project'),
  $.validateAccess('admin'),
  $.updateItem('project', 'omit:users'),
  $.updateUserAdmin('project'),
  $.saveItem('project'),
  $.respond()
)


/*
router.delete('/:id', (req, res, next) => {
  Project.findById(req.params.id, (err, project) => {
    if (err || !project) return next(err)

    if (!_.find(project.users, { _id: req.user.id, admin: true })) {
      return next(_.$err('denied'))
    }

    project.remove((err, project) => {
      if (err) return next(err)

      board.remove({ project_id: project._id }).remove((err, boards) => {
        if (err) return next(err)

        let boardIDs = _.map(boards, (b) => { return b._id })

        Task.remove({ board_id: { $in: boardIDs }}, (err, tasks) => {
          if (err) return next(err)
          res.json({ data: project })
        })
      })
    })
  })
})*/

module.exports = router
