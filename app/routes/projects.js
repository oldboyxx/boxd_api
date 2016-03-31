let router = require('express').Router()
let { Project, $ } = require('../models/project')
let { Board } = require('../models/board')
let { User } = require('../models/user')

router.post('/',
  $.createProject
)

router.get('/',
  $.getProjects
)

/*
router.get('/:id',
  $.validateAccess
)
*/
/*Project.findById(req.params.id).lean().exec((err, project) => {
  if (err || !project) return next(err)

  if (!_.find(project.users, { _id: req.user.id })) {
    return next(_.$err('denied'))
  }

  let sel = { project_id: project._id, 'users._id': req.user.id }

  Board.find(sel, 'title background project_id').lean().exec((err, boards) => {
    if (err) return next(err)

    let userIDs = _.map(project.users, (u) => { return u._id })

    User.find({ _id: { $in: userIDs }}, '-email').lean().exec((err, users) => {
      if (err) return next(err)
      res.json({ data: { project, boards, users }})
    })
  })
})*/


/**
* UPDATE project
*/

router.put('/:id', (req, res, next) => {
  let r = req.body

  Project.findById(req.params.id, (err, project) => {
    if (err || !project) return next(err)

    if (!_.find(project.users, { _id: req.user.id, admin: true })) {
      return next(_.$err('denied'))
    }

    delete r.users // Protection
    project.set(r)

    if (r.add_user_id) {
      let user = { _id: r.add_user_id, admin: r.admin }
      _.$upsert(project.users, { _id: r.add_user_id }, user)

    } else if (r.remove_user_id) {
      project.users.pull(r.remove_user_id)
    }

    project.save((err, project) => {
      if (err) return next(err)
      res.json({ data: project })
    })
  })
})

/**
* DELETE project and associated boards:lists, tasks:comments
*/

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
})

module.exports = router
