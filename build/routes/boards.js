'use strict';

var router = require('express').Router();

var _require = require('../models');

var board = _require.board;
var $ = _require.shared;


router.post('/', $.getItem('project'), $.validateAccess(), $.addFirstAdmin, $.createItem('board'), $.respond('omit:project'));

router.get('/:id', $.getItem('board'), $.getItem('project', '$.board.project_id'), $.validateAccess(), board.setQueryArgs('lists'), $.getItems('list'), board.setQueryArgs('tasks'), $.getItems('task'), board.setQueryArgs('users'), $.getItems('user'), $.respond());

router.put('/:id', $.getItem('board'), $.validateAccess('admin', 'allowPassage'), $.updateUserAdmin('board'), $.updateItem('board', 'omit:users:project_id'), $.saveItem('board'), $.respond());

module.exports = router;