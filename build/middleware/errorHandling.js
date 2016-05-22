'use strict';

var errorHandlers = {
  ValidationError: function ValidationError(err) {
    var errors = _.map(err.errors, function (val) {
      return { message: val.message, path: val.path };
    });

    return { status: 400, errors: errors };
  },
  MongoError: function MongoError(err) {
    if ((err.code === 11000 || err.code === 10001) && /email/.test(err.message)) {
      var status = 400;
      var errors = [{ message: 'This email already exists.' }];
    } else {
      var status = 500;
      var errors = [{ message: 'Internal Server Error' }];
      console.error(err.stack);
    }

    return { status: status, errors: errors };
  }
};

function defaultHandler(err) {
  var status = err.status || 500;
  var errors = Array.isArray(err) ? err : [err];

  errors = _.map(errors, function (val) {
    return { message: val.message };
  });

  if (status === 500) {
    console.error(err.stack);
    errors = [{ message: 'Internal Server Error' }];
  }

  return { status: status, errors: errors };
}

function handleErrors(err, req, res, next) {
  if (res.headersSent) return next(err);
  var handler = errorHandlers[err.name] || defaultHandler;

  var _handler = handler(err);

  var status = _handler.status;
  var errors = _handler.errors;

  res.status(status).json({ errors: errors });
}

function routeNotFound(req, res, next) {
  next(_.$err("Route '" + req.originalUrl + "' doesn't exist.", 404));
}

module.exports = { handleErrors: handleErrors, routeNotFound: routeNotFound };