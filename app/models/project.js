let actions = {

  setQueryArgs(name) {
    return (req, res, next) => {
      if (name === 'projects') {
        req.qArgs = [{ 'users._id': req.user.id }, 'title avatar']
      } else if (/boards/.test(name)) {
        let sel = name === 'boards' ? req.$.project._id : { $in: _.map(req.$.projects, '_id') }
        req.qArgs = [{ project_id: sel, 'users._id': req.user.id }, 'title background project_id']
      } else if (name === 'users') {
        req.qArgs = [{ _id: { $in: _.map(req.$.project.users, '_id') }}, '-email']
      }
      next()
    }
  }
}

module.exports = actions
