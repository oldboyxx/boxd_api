'use strict';

var router = require('express').Router();

var _require = require('../models');

var project = _require.project;
var $ = _require.shared;


router.post('/', $.addFirstAdmin, $.createItem('project'), $.respond());

router.get('/', project.setQueryArgs('projects'), $.getItems('project'), project.setQueryArgs('homeboards'), $.getItems('board'), $.respond());

router.get('/:id', $.getItem('project'), $.validateAccess(), project.setQueryArgs('boards'), $.getItems('board'), project.setQueryArgs('users'), $.getItems('user'), $.respond());

router.put('/:id', $.getItem('project'), $.validateAccess('admin', 'allowPassage'), project.addUser, $.updateUserAdmin('project'), $.updateItem('project', 'omit:users'), $.saveItem('project'), project.removeUserFromBoards, $.respond());

module.exports = router;