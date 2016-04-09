let mongoose = require('mongoose')
let f = require('faker')
let models = require('../app/models/models')

/**
* Drop database helper
*/

function dropDatabase() {
  mongoose.connection.db.dropDatabase()
}

/**
* Build objects
*/

function batchBuild(seedSize=3) {
  let seeds = {}

  let userCount = seedSize < 6 ? 6 : seedSize
  seeds.users = _.times(userCount, () => {
    return new models.User({
      name: f.name.findName(),
      email: _.random(99999999)+f.internet.email(),
      avatar: {
        provider: 'google',
        url: f.internet.avatar()
      }
    })
  })

  let projectCount = seedSize < 2 ? 2 : seedSize
  seeds.projects = _.times(projectCount, (i) => {

    let users = _.map(_.sampleSize(seeds.users, 4), (user, j) => {
      return { _id: user._id, admin: !!j }
    })

    return new models.Project({
      title: f.company.companyName(),
      users,
      archieved: !i
    })
  })

  seeds.boards = _.flatMap(seeds.projects, (project) => {
    return _.times(4, (i) => {

      let users = _.map(project.users, (user, j) => {
        return { _id: user._id, admin: !!j }
      })

      return new models.Board({
        title: f.commerce.department(),
        project_id: project._id,
        users,
        archieved: !i
      })
    })
  })

  seeds.lists = _.flatMap(seeds.boards, (board) => {
    return _.times(4, (i) => {
      return new models.List({
        title: f.commerce.department(),
        position: i,
        board_id: board._id,
        archieved: !i
      })
    })
  })

  seeds.tasks = _.flatMap(seeds.lists, (list) => {
    return _.times(4, (i) => {

      let labels = _.sampleSize(['red', 'blue', 'green', 'yellow'], 2)

      let board = _.find(seeds.boards, { _id: list.board_id })
      let users = [_.sample(board.users)._id]

      let comments = _.times(2, () => {
        return {
          content: f.company.catchPhrase(),
          user: _.sample(board.users)._id
        }
      })

      let comments_count = _.size(comments)

      return new models.Task({
        title: f.address.city(),
        labels,
        position: i,
        board_id: list.board_id,
        list_id: list._id,
        users,
        comments,
        comments_count,
        archieved: !i
      })
    })
  })

  return seeds
}

/**
* Insert objects into database
*/

let modelNames = _.map(_.keys(models), _.lowerFirst)
let objectCount = _.fromPairs(_.map(modelNames, (n) => { return [n+'s', 0] }))

function batchInsert({ batchSize=3, times=1, log=false }={}, callback) {
  if (log) console.log(times+'-----------')
  if (log) console.time('done in')

  let seeds = batchBuild(batchSize)

  _.each(modelNames, (name, i) => {
    models[_.upperFirst(name)].create(seeds[name+'s'], (err, items) => {
      if (err) return (callback || console.error)(err)

      objectCount[name+'s'] += items.length
      if (log) console.log(name + 's: ' + objectCount[name+'s'])

      if (i === modelNames.length-1) {
        if (log) console.timeEnd('done in')
        if (--times) {
          _.delay(batchInsert, 5, { batchSize, times }, callback)
        } else {
          if (callback) callback(null, seeds, objectCount)
        }
      }
    })
  })
}

/*dropDatabase()

batchInsert({ batchSize: 5, times: 10000 }, (err, objects, objectCount) => {
  if (err) throw err
  console.log(objects.tasks[0])
  console.log(objectCount)
})*/

module.exports = {
  dropDatabase,
  batchBuild,
  batchInsert
}
