'use strict';
let express = require('express');
let config = require('config');
let Emoji = require('../models/emoji');
let router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'Welcome to API'
	});
});

router.post('/default_room_image', (req, res) => {
	res.json({
		data: {
			link: config.get('default.roomimage')
		}
	});
});

router.post('/list-emoji', (req, res) => {
	if (!req.body.emojiname) {
		return res.json({
			status_code: 345,
			error: 'Please send with "emojiname"'
		});
	}
	Emoji.find({name: req.body.emojiname})
	.exec((err, emojis) => {
		if (err) {
			return res.json({
				status_code: 345,
				error: 'undefined error'
			});
		}
		res.json(emojis);
	});
});

router.get('/create-emoji', (req, res) => {
	console.log(req.body.name);
	let emoji = new Emoji({
		name: req.body.name,
		list: []
	});
	emoji.save((err) => {
		if (err) {
			return res.json({
				status_code: 345,
				error: 'Undefined error'
			});
		}
		res.json({
			status_code: 200
		});
	});
});

module.exports = router;
