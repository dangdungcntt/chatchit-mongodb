'use strict';
var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
  // res.json({
  // 	message: 'User page'
  // });
  res.render('comingsoon');
});

router.get('/:username', (req, res) => {
  // res.json({
  // 	message: 'User page'
  // });
  res.render('comingsoon');
});

module.exports = router;
