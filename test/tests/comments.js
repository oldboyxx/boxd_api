describe('CREATE /comments', () => {
  it('should create comment', (done) => {

    let { seedBoard, seedUser } = util.getObjAndUser('board')
    let seedTask = _.find(seeds.tasks, { board_id: seedBoard._id })

    let commentData = {
      content: 'Comment content',
      task_id: seedTask.id
    }

    request.post('/comments')
      .set(util.token(seedUser))
      .send(commentData)
      .expect(200)
      .expect(res => {
        let comment = res.body.data.comment
        expect(comment.content).to.contain('Comment content')
        expect(comment.user).to.equal(seedUser.id)
      }).end(done)
  })
})

describe('PUT /comments', () => {
  let seedTask, seedComment, seedUser, commentData

  it('should update comment', (done) => {

    seedTask = seeds.tasks[0]
    seedComment = seedTask.comments[0]
    seedUser = _.find(seeds.users, { _id: _.$toObjId(seedComment.user) })

    commentData = {
      content: 'updated',
      task_id: seedTask.id
    }

    request.put('/comments/'+seedComment.id)
      .set(util.token(seedUser))
      .send(commentData)
      .expect(200)
      .expect(res => {
        let comment = res.body.data.comment
        expect(comment.content).to.contain('updated')
        expect(comment.user).to.equal(seedUser.id)
      }).end(done)
  })

  it('comment should be updated', (done) => {

    request.get('/tasks/'+seedTask.id)
      .set(util.token(seedUser))
      .expect(200)
      .expect(res => {
        let contents = _.map(res.body.data.task.comments, 'content')
        expect(contents).to.contain('updated')
      })
      .end(done)
  })

  it('should NOT update comment if user isnt the comment owner', (done) => {

    let seedUser = _.reject(seeds.users, { _id: _.$toObjId(seedComment.user) })[0]

    request.put('/comments/'+seedComment.id)
      .set(util.token(seedUser))
      .send(commentData)
      .expect(403)
      .end(done)
  })
})

describe('DELETE /comments', () => {
  let seedTask, seedComment, seedUser, commentData

  it('should delete comment', (done) => {

    seedTask = seeds.tasks[0]
    seedComment = seedTask.comments[0]
    seedUser = _.find(seeds.users, { _id: _.$toObjId(seedComment.user) })

    commentData = {
      task_id: seedTask.id
    }

    request.del('/comments/'+seedComment.id)
      .set(util.token(seedUser))
      .send(commentData)
      .expect(200)
      .expect(res => {
        expect(res.body.data.comment._id).to.equal(seedComment.id)
      }).end(done)
  })

  it('deleted comment should not exist', (done) => {

    request.del('/comments/'+seedComment.id)
      .set(util.token(seedUser))
      .send(commentData)
      .expect(404)
      .end(done)
  })
})
