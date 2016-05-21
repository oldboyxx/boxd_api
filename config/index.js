let config = {

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
    appURL: 'https://boxd-api.herokuapp.com'
  }
}

let secrets
try {
  secrets = require('./secrets')
} catch(err) {
  secrets = _.pick(process.env, [
    'googleOAuthClientID',
    'googleOAuthSecret',
    'JWTSecret',
    'adminEmails',
    'dbPath'
  ])
}

let cf = _.merge(config.base, config[process.env.NODE_ENV], secrets)

module.exports = cf
