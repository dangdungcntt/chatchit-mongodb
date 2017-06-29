'use strict';
// let helper = require('../helpers/helper');
module.exports = (io) => {
	let listAllRoom = require('../common/list-all-room');
	let nsRoom = io.of('/room');
	let nsListRoom = io.of('/list-room');

	nsListRoom.on('connection', (socket) => {
		console.log('someone connected nsListRoom, id = ', socket.id);

		socket.emit('send-list-room', listAllRoom.getListRoom());
		socket.on('create-room', (room) => {
			nsListRoom.emit('new-room-created', room);
			nsRoom.emit('new-room-created', room);
			socket.emit('created');
		});
	});

	nsRoom.on('connection', (socket) => {
		console.log('someone connected nsRoom, id = ', socket.id);

		socket.on('disconnect', () => {
			if (listAllRoom.removeAUserInRoom(socket.roomid, socket.username)) {
				nsRoom.to(socket.roomid).emit('a-user-disconnected', { username: socket.username, name: socket.name });
				nsListRoom.emit('a-user-leaved-room', socket.roomid);
				nsRoom.emit('a-user-leaved-room', socket.roomid);
			}
		});

		socket.on('connect-me-to-room', (data) => {
      console.log(data.roomid);
			socket.roomid = data.roomid;
			socket.username = data.username;
			socket.name = data.name;
			socket.fbid = data.fbid;

			let exi = listAllRoom.checkUserExists(data.roomid, data.username);
			let i = listAllRoom.checkRoomExists(data.roomid);
			data.listUser = listAllRoom.getListUserOfRoom(i);

			data.listRoom = listAllRoom.getListRoom();

			let user = { username: socket.username, name: socket.name, fbid: data.fbid, count: 1 };

			if (exi) {
				listAllRoom.addUserInRoom(i, user);
			} else {
				listAllRoom.pushUserToRoom(i, user);
			}

			socket.join(data.roomid, () => {
				socket.emit('connect-successfully', data);
				if (!exi) {
					socket.broadcast.to(data.roomid).emit('a-user-connected', user);
					nsListRoom.emit('a-user-joined-room', data.roomid);
					socket.emit('a-user-leaved-room', data.roomid);
					nsRoom.emit('a-user-joined-room', data.roomid);
				}
			});
		});

		socket.on('user-send-messages', (message) => {
			nsRoom.to(socket.roomid).emit('someone-send-message', {
				username: socket.username,
				name: socket.name,
				message,
				fbid: socket.fbid
			});
		});

		socket.on('user-send-image', (time) => {
			nsRoom.to(socket.roomid).emit('someone-send-image', {
				username: socket.username,
				name: socket.name,
				time,
				fbid: socket.fbid
			});
		});

		socket.on('update-src-for-image', (data) => {
			nsRoom.to(socket.roomid).emit('update-src-for-image', data);
		});
	});

};
