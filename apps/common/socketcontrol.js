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
		});
	});
	
	
	nsRoom.on('connection', (socket) => {
	  	console.log('someone connected nsRoom, id = ', socket.id);

	  	socket.on('disconnect', () => {
	  		if (listAllRoom.removeAUserInRoom(socket.roomid, socket.username)) {
	  			nsRoom.to(socket.roomid).emit('a-user-disconnected', {username: socket.username, name: socket.name});
	  			nsListRoom.emit('a-user-leaved-room', socket.roomid);
	  			nsRoom.emit('a-user-leaved-room', socket.roomid);
	  		}
	  	});

	  	socket.on('connect-me-to-room', (data) => {
	  		socket.roomid = data.roomid;
	  		socket.username = data.username;
	  		socket.name = data.name;
	  		socket.fbid = data.fbid;

	  		let exi = listAllRoom.checkUserExists(data.roomid, data.username);
		  	let i = listAllRoom.checkRoomExists(data.roomid);
		  	data.listUser = listAllRoom.getListUserOfRoom(i);

		  	data.listRoom = listAllRoom.getListRoom();

		  	let user = {username: socket.username, name: socket.name, fbid: data.fbid, count: 1};

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
	  		nsRoom.to(socket.roomid).emit('someone-send-message', {username: socket.username, name: socket.name, message, fbid: socket.fbid});
	  	});
	});

};


	// io.on('connection', (socket) => {

	// 	console.log('A client was connected, id = ' + socket.id);

	// 	socket.on('disconnect', () => {
	// 		let i = listId.indexOf(socket.id);
	//         if (i > -1) {
	//         	io.sockets.emit('server_send_a_client_has_left', {
	// 	        	username: socket.username,
	// 	        	id: socket.id
	// 	        });
	// 	        listUser.splice(i, 1);
	// 	        listId.splice(i, 1);
	//         }
	//     });

	//     socket.on('client_send_register', (username) => {
	//        	if (listId.indexOf(socket.id) >= 0) {
	//         	return socket.emit('server_send_registered', username);
	//         }

	//         if (!helper.isAlphanumeric(username)) {
	//         	return socket.emit('server_send_registered', username);
	//         }

	//         if (listUser.indexOf(username) >= 0) {
	//             return socket.emit('server_send_register_fail', username);
	//         }

	//         socket.username = username;
 //        	socket.emit('server_send_all_client_online_to_new_client', { //kết nối vào là gửi danh sách người đang online
	// 	        username: listUser,
	// 	        id: listId
	// 	    });

	// 	    io.sockets.emit('server_send_new_user_to_another_user', {
 //                username: username,
 //                id: socket.id
 //            });

 //            socket.emit('server_send_successful_registration_to_new_client', {
 //                username: username,
 //                id: socket.id
 //            });

 //            listUser.push(username);
 //            listId.push(socket.id);
	        
	//     });

	//     socket.on('client_send_messages', (data) => {
	//         io.sockets.emit('server_send_messages_to_another_client', {
	//             message: data.message,
	//             username: socket.username,
	//             id: data.id
	//         });
	//     });
	// });
// };