let actions = {

  setQueryArgs(name) {
    return (req, res, next) => {
      if (name === 'lists') {
        req.qArgs = [{ board_id: req.$.board._id }]
      } else if (name === 'tasks') {
        req.qArgs = [{ list_id: { $in: _.map(req.$.lists, '_id') }}, '-desc -comments']
      } else if (name === 'users') {
        let IDs = _.uniq(_.flatMap(req.$.tasks, 'users').concat(_.map(req.$.board.users, '_id')))
        req.qArgs = [{ _id: { $in: IDs }}, '-email']
      }
      next()
    }
  }
}

module.exports = actions
