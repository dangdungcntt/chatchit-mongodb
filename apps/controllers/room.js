'use strict';
let express = require('express');

let router = express.Router();

let listAllRoom = require('../common/list-all-room');

router.get('/', (req, res) => {
	res.redirect('../list-room/');
});

router.get('/:id', (req, res) => {
	let roomid = req.params.id;
	let { username, name, fbid } = req.session.user;
	// console.log(req.session.user);
	if (listAllRoom.checkRoomExists(roomid) === -1) {
		return res.render('room/create-room', {
			data: {
				roomid,
				username,
				name,
				fbid,
				message: 'Room ' + roomid + ' does not exists.<br>Create a new room now!'
			}
		});
	}
	
	res.render('room', {
		data: {
			roomid,
			username,
			name,
			fbid
		}
	});
});


module.exports = router;
