'use strict';
let express = require('express');
let account = require('./account');
let config = require('config');
// let multer = require('multer');
let listAllRoom = require('../common/list-all-room');
let router = express.Router();


// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/uploads');
//   },
//   filename: (req, file, cb) => {
//   	let arr = file.originalname.split('.');
//   	let ext = arr[arr.length - 1];
//     cb(null, 'room-' + req.body.roomid + '-' + Date.now() + '.' + ext);
//   }
// });
// let maxSize = 2097152;
// var upload = multer({ 
// 	storage: storage,
// 	limits: { fileSize: maxSize },
// 	fileFilter: (req, file, cb) => {
// 		let arr = file.mimetype.split('/');
// 		if (arr[0] !== 'image') {
// 			let err = new Error('ONLY_IMAGE_FILE');
// 			err.code = 'ONLY_IMAGE_FILE';
// 			return cb(err);
// 		}
// 	  	cb(null, true);
// 	}
// }).single('roomimage');

router.use(account);

//mid
router.use((req, res, next) => {
	if (!req.session.user) {
		req.session.redirectUrl = req.url;
		return res.redirect('/login');
	}
	next();
});

router.use('/room', require('./room'));
router.use('/admin', require('./admin'));
router.use('/profile', require('./profile'));

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

router.post('/default_room_image', (req, res) => {
	res.json({
		data: {
			link: config.get('default.roomimage')
		}
	});
});

router.get('/create-room', (req, res) => {
	let { username, name, fbid} = req.session.user;
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
