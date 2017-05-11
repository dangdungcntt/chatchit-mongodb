'use strict';
var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
	// res.json({
	// 	message: 'User page'
	// });
	res.render('chat-room/chat', {
		data: {
			user: req.session.user
		}
	});
});

module.exports = router;
