let markdown = require('markdown-it')()
let { Task } = require('./models')

let actions = {

  validateListAccess(req, res, next) {
    if (!req.$.list) return next()
    let valid = req.$.list.board_id.toString() === req.$.board._id.toString()
    next(valid ? null : _.$err('denied'))
  },

  getBoardID(req, res, next) {
    req.body.board_id = req.$.board.id
    next()
  },

  updateArrays(req, res, next) {
    let r = req.body

    _.each(['label', 'user'], (type) => {
      if (r['add_'+type]) {
        req.$.task[type+'s'].addToSet(r['add_'+type])
      } else if (r['remove_'+type]) {
        req.$.task[type+'s'].pull(r['remove_'+type])
      }
    })
    next()
  },

  getUserIDs(req, res, next) {
    let IDs = _.uniq(req.$.task.users.concat(_.map(req.$.task.comments, 'user')))
    req.qArgs = [{ _id: { $in: IDs }}, '-email']
    next()
  },

  parseDescMarkdown(req, res, next) {
    req.$.task = req.$.task.toJSON()
    if (!req.$.task.desc) return next()
    req.$.task.desc_parsed = markdown.render(req.$.task.desc)
    next()
  },

  setBoardQueryArgs(req, res, next) {
    req.qArgs = [{ 'users._id': req.user.id, archieved: false }]
    next()
  },

  searchTasks(req, res, next) {
    let IDs = _.map(req.$.boards, '_id')

    Task.find({
      board_id: { $in: IDs }, archieved: false,
      $text: { $search: req.query.search }
    }, {
      score: { $meta: 'textScore' }
    }).sort({ score: { $meta: 'textScore' }}).limit(20).lean().exec((err, tasks) => {
      if (err) next(err)
      req.$.tasks = tasks
      next()
    })
  }
}


module.exports = actions

