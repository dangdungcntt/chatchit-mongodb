'use strict';
var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
	// res.json({
	// 	message: 'User page'
	// });
	res.render('signup');
});

module.exports = router;
