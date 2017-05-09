'use strict';
var express = require('express');

var router = express.Router();

router.use('/admin', require('./admin'));
router.use('/user', require('./user'));

router.get('/', (req, res) => {
	// res.json({
	// 	message: 'Home page'
	// });
	res.render('home');
});

router.get('/:string', (req, res) => {
	// res.json({
	// 	message: 'Home page'
	// });
	res.render('signup');
});

module.exports = router;
