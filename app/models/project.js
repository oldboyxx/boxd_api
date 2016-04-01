let { Project, User, Board } = require('./models')

let actions = {

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

  getBoards(req, res, next) {
    let sel = { project_id: req.project._id, 'users._id': req.user.id }

    Board.find(sel, 'title background project_id').lean().exec((err, boards) => {
      if (err) return next(err)
      req.boards = boards
      next()
    })
  },

  getUsers(req, res, next) {
    let userIDs = _.map(req.project.users, (u) => { return u._id })

    User.find({ _id: { $in: userIDs }}, '-email').lean().exec((err, users) => {
      if (err) return next(err)
      req.users = users
      next()
    })
  },

  returnProjectBoardsUsers(req, res, next) {
    res.json({ data: { project: req.project, boards: req.boards, users: req.users }})
  },

  updateProject(req, res, next) {
    let r = req.body

    delete r.users // Protection
    req.project.set(r)

    if (r.add_user_id) {
      let user = { _id: r.add_user_id, admin: r.admin }
      _.$upsert(req.project.users, { _id: r.add_user_id }, user)

    } else if (r.remove_user_id) {
      req.project.users.pull(r.remove_user_id)
    }

    req.project.save((err, project) => {
      if (err) return next(err)
      res.json({ data: project })
    })
  }
}

module.exports = actions
