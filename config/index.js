let config = {
  base: {
    port: process.env.PORT || 3000
  },

  dev: {
  },

  prod: {
  }
}

let cf = _.merge({}, config.base)
cf.dev = _.merge({}, config.base, config.dev)
cf.prod = _.merge({}, config.base, config.prod)

module.exports = cf
