'use strict';

var markdown = require('markdown-it')();

var _require = require('./models');

var Task = _require.Task;


var actions = {
  validateListAccess: function validateListAccess(req, res, next) {
    if (!req.$.list) return next();
    var valid = req.$.list.board_id.toString() === req.$.board._id.toString();
    next(valid ? null : _.$err('denied'));
  },
  getBoardID: function getBoardID(req, res, next) {
    req.body.board_id = req.$.board.id;
    next();
  },
  updateArrays: function updateArrays(req, res, next) {
    var r = req.body;

    _.each(['label', 'user'], function (type) {
      if (r['add_' + type]) {
        req.$.task[type + 's'].addToSet(r['add_' + type]);
      } else if (r['remove_' + type]) {
        req.$.task[type + 's'].pull(r['remove_' + type]);
      }
    });
    next();
  },
  getUserIDs: function getUserIDs(req, res, next) {
    var IDs = _.uniq(req.$.task.users.concat(_.map(req.$.task.comments, 'user')));
    req.qArgs = [{ _id: { $in: IDs } }, '-email'];
    next();
  },
  parseDescMarkdown: function parseDescMarkdown(req, res, next) {
    req.$.task = req.$.task.toJSON();
    if (!req.$.task.desc) return next();
    req.$.task.desc_parsed = markdown.render(req.$.task.desc);
    next();
  },
  setBoardQueryArgs: function setBoardQueryArgs(req, res, next) {
    req.qArgs = [{ 'users._id': req.user.id, archieved: false }];
    next();
  },
  searchTasks: function searchTasks(req, res, next) {
    var IDs = _.map(req.$.boards, '_id');

    Task.find({
      board_id: { $in: IDs }, archieved: false,
      $text: { $search: req.query.search }
    }, {
      score: { $meta: 'textScore' }
    }).sort({ score: { $meta: 'textScore' } }).limit(20).lean().exec(function (err, tasks) {
      if (err) next(err);
      req.$.tasks = tasks;
      next();
    });
  }
};

module.exports = actions;