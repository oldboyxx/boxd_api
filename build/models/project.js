'use strict';

var _require = require('./models');

var Board = _require.Board;
var User = _require.User;


var actions = {
  setQueryArgs: function setQueryArgs(name) {
    return function (req, res, next) {

      if (name === 'projects') {
        var archieved = !!req.query.archieved_projects;
        req.qArgs = [{ 'users._id': req.user.id, archieved: archieved }, 'title avatar archieved'];
      } else if (/boards/.test(name)) {
        var isHome = name !== 'boards';
        var _archieved = isHome ? false : !!req.query.archieved_boards;
        var sel = isHome ? { $in: _.map(req.$.projects, '_id') } : req.$.project._id;

        req.qArgs = [{ project_id: sel, 'users._id': req.user.id, archieved: _archieved }, 'title background project_id archieved'];
      } else if (name === 'users') {
        req.qArgs = [{ _id: { $in: _.map(req.$.project.users, '_id') } }, '-email -created_at -updated_at'];
      }
      next();
    };
  },
  removeUserFromBoards: function removeUserFromBoards(req, res, next) {
    var r = req.body;
    if (!r.remove_user) return next();

    var sel = { project_id: req.$.project._id, 'users._id': r.remove_user };
    var cmd = { $pull: { users: { _id: r.remove_user } } };

    Board.update(sel, cmd, { multi: true }, next);
  },
  addUser: function addUser(req, res, next) {
    if (!req.body.add_user_email || req.accessValidated === false) return next();

    User.findOne({ email: req.body.add_user_email }, function (err, user) {
      if (err) return next(err);
      if (!user) return next(_.$err("User account with this email doesn't exist.", 404));

      req.body = { add_user: user.id, admin: false };
      req.$.added_user = user;
      next();
    });
  }
};

module.exports = actions;