var config = {

  base: {
    port: process.env.$PORT || process.env.PORT || 3000
  },

  development: {
    appURL: 'http://localhost:3000',
    devEmail: 'dank@memer.com'
  },

  test: {
    appURL: 'http://localhost:3000',
    devEmail: 'dank@memer.com'
  },

  production: {
    appURL: 'http://boxd.oldboyfx.com'
  }
}

try {
  var secrets = require('./secrets')
} catch(err) {
  var secrets = _.pick(process.env, [
    'googleOAuthClientID',
    'googleOAuthSecret',
    'JWTSecret',
    'adminEmails',
    'dbPath'
  ])
}

var cf = _.merge(config.base, config[process.env.NODE_ENV], secrets)

module.exports = cf
