let mongoose = require('mongoose')
let Schema = mongoose.Schema
let { userAdminSchema } = require('./_shared')

let projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  desc: {
    type: String,
    maxlength: 500
  },
  avatar: {
    type: String,
    maxlength: 500
  },

  users: {
    type: [userAdminSchema],
    validate: {
      validator(arr) { return !!_.find(arr, { admin: true }) },
      message: 'You can\'t remove all admins from a project.'
    }
  }
})

let Project = mongoose.model('Project', projectSchema)

let $ = {

  createProject(req, res, next) {
    req.body.users = [{ _id: req.user.id, admin: true }]

    Project.create(req.body, (err, project) => {
      if (err) return next(err)
      res.json({ data: project })
    })
  },

  getProjects(req, res, next) {
    Project.find({ 'users._id': req.user.id }, 'title avatar').lean().exec((err, projects) => {
      if (err) return next(err)

      let sel = { project_id: { $in: _.map(projects, '_id') }, 'users._id': req.user.id }

      Board.find(sel, 'title background project_id').lean().exec((err, boards) => {
        if (err) return next(err)
        res.json({ data: { projects, boards }})
      })
    })
  },

  getProject(req, res, next) {
    Project.findById(req.params.id).lean().exec((err, project) => {
      if (err) return next(err)
      if (!project) return next(_.$err('project:null'))
      req.project = project
      next()
    })
  },

  validateAccess(req, res, next) {
      let yep = _.find(req.project.users, { _id: req.user.id })
      next(yep ? null : _.$err("denied"))
    })
  },

  getProject(req, res, next) {
    let sel = { project_id: project._id, 'users._id': req.user.id }

    Board.find(sel, 'title background project_id').lean().exec((err, boards) => {
      if (err) return next(err)

      let userIDs = _.map(project.users, (u) => { return u._id })

      User.find({ _id: { $in: userIDs }}, '-email').lean().exec((err, users) => {
        if (err) return next(err)
        res.json({ data: { project, boards, users }})
      })
    })
  }


























































}

module.exports = { projectSchema, Project, $ }
