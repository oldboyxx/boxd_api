'use strict';

var _require = require('../models/models');

var Project = _require.Project;
var Board = _require.Board;
var List = _require.List;
var Task = _require.Task;


function createOnboardingProject(userID, callback) {

  var project = new Project({
    title: 'Project: Hello World',
    desc: 'Feel free to archive me.',
    users: [{ _id: userID, admin: true }]
  });

  Project.create(project, function () {

    var board = new Board({
      title: 'Welcome!',
      project_id: project._id,
      users: [{ _id: userID, admin: true }]
    });

    Board.create(board, function () {

      var lists = [];

      lists.push(new List({
        title: 'Basics',
        board_id: board._id,
        position: 1
      }));

      lists.push(new List({
        title: 'Intermediate',
        board_id: board._id,
        position: 2
      }));

      List.create(lists, function () {

        var tasks = [];

        tasks.push(new Task({
          title: 'This is a task.',
          list_id: lists[0]._id,
          board_id: board._id,
          position: 1
        }));

        tasks.push(new Task({
          title: 'Click on a task to see what\'s behind it',
          desc: 'Nothing in particular...',
          list_id: lists[0]._id,
          board_id: board._id,
          position: 2
        }));

        tasks.push(new Task({
          title: 'Try dragging and sorting both lists and tasks.',
          list_id: lists[0]._id,
          board_id: board._id,
          position: 3
        }));

        tasks.push(new Task({
          title: 'You can use markdown for task descriptions.',
          desc: "#### Colons can be used to align columns.\n\n| Tables        | Are           | Cool  |\n| ------------- |:-------------:| -----:|\n| col 3 is      | right-aligned |  |\n| col 2 is      | centered      |    |\n| zebra stripes | are neat      |     |\n\nThe outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily. You can also use inline Markdown.\n\nMarkdown | Less | Pretty\n--- | --- | ---\n*Still* | `renders` | **nicely**\n1 | 2 | 3",
          list_id: lists[0]._id,
          board_id: board._id,
          position: 4
        }));

        tasks.push(new Task({
          title: 'You can assign a due date to any task.',
          due_date: new Date(),
          list_id: lists[1]._id,
          board_id: board._id,
          position: 1
        }));

        tasks.push(new Task({
          title: 'Try leaving a comment on this task.',
          comments: [{ content: 'I\'m from the future!', user: userID, created_at: new Date() }],
          list_id: lists[1]._id,
          board_id: board._id,
          position: 2
        }));

        tasks.push(new Task({
          title: 'You can assign members to any task.',
          users: [userID],
          list_id: lists[1]._id,
          board_id: board._id,
          position: 3
        }));

        Task.create(tasks, function () {
          callback();
        });
      });
    });
  });
}

module.exports = createOnboardingProject;