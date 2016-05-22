'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var models = require('./models');

var actions = {
  addFirstAdmin: function addFirstAdmin(req, res, next) {
    req.body.users = [{ _id: req.user.id, admin: true }];
    next();
  },
  validateAccess: function validateAccess(admin, allowPassage) {
    return function (req, res, next) {
      var match = { _id: req.user.id };
      if (admin) _.merge(match, { admin: true });

      var obj = req.$.board || req.$.project; // board must be first
      if (!obj) return next(_.$err('Validation object missing', 400));

      var valid = !!_.find(obj.users, match);

      if (allowPassage) {
        req.accessValidated = valid;
        next();
      } else {
        next(valid ? null : _.$err('denied'));
      }
    };
  },
  createItem: function createItem(model) {
    return function (req, res, next) {
      models[_.capitalize(model)].create(req.body, function (err, item) {
        if (err) return next(err);
        req.$[model] = item;
        next();
      });
    };
  },
  getItems: function getItems(model) {
    return function (req, res, next) {
      var _models$_$capitalize;

      var args = req.qArgs || [{}];

      (_models$_$capitalize = models[_.capitalize(model)]).find.apply(_models$_$capitalize, _toConsumableArray(args)).lean().exec(function (err, items) {
        if (err) return next(err);
        req.$[model + 's'] = items;
        next();
      });
    };
  },
  getItem: function getItem(model, idPath, notRequired) {
    return function (req, res, next) {
      var id = idPath ? _.get(req, idPath) : req.body[model + '_id'];
      if (!id && notRequired) return next();

      models[_.capitalize(model)].findById(id, function (err, item) {
        if (err) return next(err);
        if (!item) return next(_.$err(model + ':null'));
        req.$[model] = item;
        next();
      });
    };
  },
  updateUserAdmin: function updateUserAdmin(model) {
    return function (req, res, next) {
      var r = req.body;

      if (req.accessValidated === false) {
        // Remove self if not admin
        if (r.remove_user === req.user.id) {
          r = _.pick(r, ['remove_user']);
        } else {
          next(_.$err('denied'));
        }
      }

      if (r.add_user) {
        var user = { _id: r.add_user, admin: r.admin };
        _.$upsert(req.$[model].users, { _id: r.add_user }, user);
      } else if (r.remove_user) {
        req.$[model].users.pull(r.remove_user);
      }

      next();
    };
  },
  updateItem: function updateItem(model, omit) {
    return function (req, res, next) {
      if (omit) req.body = _.omit(req.body, _.tail(omit.split(':')));
      req.$[model].set(req.body);
      next();
    };
  },
  saveItem: function saveItem(model) {
    return function (req, res, next) {
      req.$[model].save(function (err, item) {
        if (err) return next(err);
        req.$[model] = item;
        next();
      });
    };
  },
  respond: function respond(omit) {
    return function (req, res, next) {
      if (omit) req.$ = _.omit(req.$, _.tail(omit.split(':')));
      res.json({ data: req.$ });
    };
  }
};

module.exports = actions;