let mongoose = require('mongoose')
let router = require('express').Router()
let { model: Project } = require('../models/project')
let { model: Board } = require('../models/board')

router.get('/', (req, res, next) => {
  Project.find({ 'users._id': req.user.id, archieved: false }, (err, projects) => {
    if (err) return next(err)

    let project_ids = _.map(projects, (p) => { return p._id })

    Board.find({ _id: { $in: project_ids }, archieved: false }, (err, boards) => {
      if (err) return next(err)
      res.json({ data: { projects, boards }})
    })
  })
})

router.get('/:id', (req, res, next) => {
  Project.findById(req.params.id, (err, project) => {
    if (err || !project) return next(err)

    if (!_.find(project.users, { _id: req.user.id })) {
      return next(_.$err("notAuthorized"))
    }

    Board.find({ _id: project._id, archieved: false }, (err, boards) => {
      if (err) return next(err)
      res.json({ data: { project, boards }})
    })
  })
})

router.post('/', (req, res, next) => {
  req.body.users = [{ _id: req.user.id, admin: true }]

  Project.create(req.body, (err, project) => {
    if (err) return next(err)
    res.json({ data: project })
  })
})

router.put('/:id', (req, res, next) => {
  let r = req.body

  Project.findById(req.params.id, (err, project) => {
    if (err || !project) return next(err)

    if (!_.find(project.users, { _id: req.user.id })) {
      return next(_.$err("notAuthorized"))
    }

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

module.exports = router
