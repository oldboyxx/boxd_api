let actions = {

  setQueryArgs(name) {
    return (req, res, next) => {

      if (name === 'lists') {
        let archieved = !!req.body.archieved_lists
        req.qArgs = [{ board_id: req.$.board._id, archieved },  '-created_at -updated_at']

      } else if (name === 'tasks') {
        let archieved = !!req.body.archieved_tasks
        req.qArgs = [{ list_id: { $in: _.map(req.$.lists, '_id') }, archieved }, '-desc -comments -created_at -updated_at']

      } else if (name === 'users') {
        let IDs = _.uniq(_.flatMap(req.$.tasks, 'users').concat(_.map(req.$.board.users, '_id')))
        req.qArgs = [{ _id: { $in: IDs }}, '-email -created_at -updated_at']
      }
      next()
    }
  }
}

module.exports = actions