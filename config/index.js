let config = {

  base: {
    port: process.env.PORT || 3000
  },

  development: {
    host: 'http://localhost:3000'
  },

  production: {
  }
}

let cf = _.merge(config.base, config[process.env.NODE_ENV], require('./secrets'))

module.exports = cf
