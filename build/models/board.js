'use strict';

var actions = {
  setQueryArgs: function setQueryArgs(name) {
    return function (req, res, next) {

      if (name === 'lists') {
        var archieved = !!req.query.archieved_lists;
        req.qArgs = [{ board_id: req.$.board._id, archieved: archieved }, '-updated_at'];
      } else if (name === 'tasks') {
        var _archieved = !!req.query.archieved_tasks;
        req.qArgs = [{ list_id: { $in: _.map(req.$.lists, '_id') }, archieved: _archieved }, '-desc -comments -updated_at'];
      } else if (name === 'users') {
        var IDs = _.uniq(_.flatMap(req.$.tasks, 'users').concat(_.map(req.$.project.users, '_id')));
        req.qArgs = [{ _id: { $in: IDs } }, '-email -created_at -updated_at'];
      }

      next();
    };
  },
  updateLabel: function updateLabel(req, res, next) {
    var newLabel = req.body.update_label;

    if (newLabel) {
      var label = req.$.board.labels.id(newLabel._id);
      if (label) label.set(newLabel);
    }

    next();
  }
};

module.exports = actions;