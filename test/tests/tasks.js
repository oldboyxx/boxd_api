describe('CREATE /tasks', () => {
  it('should create task', (done) => {

    let { seedBoard, seedUser } = util.getObjAndUser('board')
    let seedList = _.find(seeds.lists, { board_id: seedBoard._id })

    let taskData = {
      title: 'Task title',
      position: 1,
      board_id: seedBoard.id,
      list_id: seedList.id
    }

    request.post('/tasks')
      .set(util.token(seedUser))
      .send(taskData)
      .expect(200)
      .expect(res => {
        let task = res.body.data.task
        expect(task.title).to.contain('Task title')
        expect(task.board_id).to.equal(seedBoard.id)
        expect(task.list_id).to.equal(seedList.id)
        expect(task.archieved).to.be.false
      }).end(done)
  })
})

describe('GET /tasks/:id', () => {
  it('should return single task with comments, users', (done) => {

    let { seedBoard, seedUser } = util.getObjAndUser('board')
    let seedTask = _.find(seeds.tasks, { board_id: seedBoard._id })

    request.get('/tasks/'+seedTask.id)
      .set(util.token(seedUser))
      .expect(200)
      .expect(res => {
        let data = res.body.data
        expect(data.task._id).to.equal(seedTask.id)
        expect(data.task.labels).to.be.an('array')
        expect(data.task.users).to.be.an('array')
        expect(data.task.comments).to.be.an('array').and.not.be.empty
        expect(data.task.comments_count).to.be.a('number')
        expect(data.users).to.be.an('array').and.not.be.empty
      }).end(done)
  })
})

describe('PUT /tasks/:id', () => {
  it('should update task', (done) => {

    let { seedBoard, seedUser } = util.getObjAndUser('board', false)
    let seedTask = _.find(seeds.tasks, { board_id: seedBoard._id })
    let seedBoardLabel = seedBoard.labels[0]
    let seedTaskUser = _.reject(seedBoard.users, { _id: seedTask.users[0] })[0]._id

    let seedList = _.find(seeds.lists, (list) => {
      return list.board_id.toString() === seedBoard.id
          && list.id !== seedTask.list_id.toString()
    })

    let updateData = {
      position: 10,
      add_label: seedBoardLabel.id,
      add_user: seedTaskUser,
      list_id: seedList.id,
      comments_count: 666
    }

    request.put('/tasks/'+seedTask.id)
      .set(util.token(seedUser))
      .send(updateData)
      .expect(200)
      .expect(res => {
        let task = res.body.data.task
        expect(task.position).to.equal(10)
        expect(task.labels).to.contain(seedBoardLabel.id)
        expect(task.users).to.contain(seedTaskUser)
        expect(task.list_id).to.equal(seedList.id)
        expect(task.comments_count).to.not.equal(666)
      }).end(done)
  })

  it('should NOT update task when list_id belongs to a different board', (done) => {

    let { seedBoard, seedUser } = util.getObjAndUser('board')
    let seedTask = _.find(seeds.tasks, { board_id: seedBoard._id })

    let seedList = _.find(seeds.lists, (list) => {
      return list.board_id.toString() !== seedBoard.id
    })

    let updateData = {
      position: 10,
      list_id: seedList.id
    }

    request.put('/tasks/'+seedTask.id)
      .set(util.token(seedUser))
      .send(updateData)
      .expect(403)
      .end(done)
  })
})
