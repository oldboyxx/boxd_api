let actions = {

  setQueryArgs(name) {
    return (req, res, next) => {

      if (name === 'lists') {
        let archieved = !!req.query.archieved_lists
        req.qArgs = [{ board_id: req.$.board._id, archieved },  '-updated_at']

      } else if (name === 'tasks') {
        let archieved = !!req.query.archieved_tasks
        req.qArgs = [{ list_id: { $in: _.map(req.$.lists, '_id') }, archieved }, '-desc -comments -updated_at']

      } else if (name === 'users') {
        let IDs = _.uniq(_.flatMap(req.$.tasks, 'users').concat(_.map(req.$.project.users, '_id')))
        req.qArgs = [{ _id: { $in: IDs }}, '-email -created_at -updated_at']
      }
      next()
    }
  },

  addDefaultLabels(req, res, next) {
    req.body.labels = actions.getDefaultLabels()
    next()
  },

  updateLabel(req, res, next) {
    let newLabel = req.body.update_label
    if (newLabel) req.$.board.labels.id(newLabel._id).set(newLabel)
    next()
  },

  getDefaultLabels() {
    return [
      { title: '', color: '#5DB94F' },
      { title: '', color: '#F3D300' },
      { title: '', color: '#FFAB49' },
      { title: '', color: '#ED5F45' },
      { title: '', color: '#C57EE0' },
      { title: '', color: '#007BBF' }
    ]
  }
}


module.exports = actions
