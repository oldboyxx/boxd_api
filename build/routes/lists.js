'use strict';

var router = require('express').Router();

var _require = require('../models');

var list = _require.list;
var $ = _require.shared;


router.post('/', $.getItem('board'), $.validateAccess(), $.createItem('list'), $.respond('omit:board'));

router.put('/:id', $.getItem('list'), $.getItem('board', '$.list.board_id'), $.validateAccess(), $.updateItem('list', 'omit:board_id'), $.saveItem('list'), $.respond('omit:board'));

module.exports = router;