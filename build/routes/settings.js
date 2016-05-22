'use strict';

var router = require('express').Router();

var _require = require('../models');

var user = _require.user;
var $ = _require.shared;


router.get('/', $.getItem('user', 'user.id'), $.respond());

router.put('/', $.getItem('user', 'user.id'), $.updateItem('user'), $.saveItem('user'), $.respond());

module.exports = router;