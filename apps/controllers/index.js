'use strict';
let express = require('express');
let account = require('./account');
let listAllRoom = require('../common/list-all-room');
let router = express.Router();

router.use(account);

//mid
router.use((req, res, next) => {
	if (!req.session.user) {
		req.session.redirectUrl = req.url;
		return res.redirect('/login');
	}
	next();
});

router.use('/api', require('./api'));
router.use('/admin', require('./admin'));
router.use('/messages', require('./messages'));
router.use('/profile', require('./profile'));
router.use('/room', require('./room'));


router.get('/', (req, res) => {
	res.render('home', {
		data: req.session.user
	});
});


router.get('/list-room', (req, res) => {
	res.render('list-room', {
		data: req.session.user,
	});
});

router.get('/create-room', (req, res) => {
	let { username, name, fbid } = req.session.user;
	res.render('room/create-room', {
		data: {
			username,
			name,
			fbid,
			message: 'Create Room'
		}
	});
});

router.post('/create-room', (req, res) => {
	if (listAllRoom.checkRoomExists(req.body.roomid) > -1) {
		return res.json({
			status_code: 345,
			error: 'Room already exists'
		});
	}
	let { roomid, roomname, roomimage, master} = req.body;
	let room = {
		roomid,
		roomname,
		roomimage,
		master,
		listUser: [] 
	};
	listAllRoom.pushRoom(room);
	return res.json({
		status_code: 200,
		room
	});
});

router.get('/:string', (req, res) => {
	res.render('comingsoon');
});

module.exports = router;
