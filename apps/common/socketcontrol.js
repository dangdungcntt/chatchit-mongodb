'use strict';
let helper = require('../helpers/helper');
module.exports = (io) => {
	
	let listUser = [];
	let listId =[];

	io.on('connection', (socket) => {

		console.log('A client was connected, id = ' + socket.id);

		socket.on('disconnect', () => {
			let i = listId.indexOf(socket.id);
	        if (i > -1) {
	        	io.sockets.emit('server_send_a_client_has_left', {
		        	username: socket.username,
		        	id: socket.id
		        });
		        listUser.splice(i, 1);
		        listId.splice(i, 1);
	        }
	    });

	    socket.on('client_send_register', (username) => {
	       	if (listId.indexOf(socket.id) >= 0) {
	        	return socket.emit('server_send_registered', username);
	        }

	        if (!helper.isAlphanumberic(username)) {
	        	return socket.emit('server_send_registered', username);
	        }

	        if (listUser.indexOf(username) >= 0) {
	            return socket.emit('server_send_register_fail', username);
	        }

	        socket.username = username;
        	socket.emit('server_send_all_client_online_to_new_client', { //kết nối vào là gửi danh sách người đang online
		        username: listUser,
		        id: listId
		    });

		    io.sockets.emit('server_send_new_user_to_another_user', {
                username: username,
                id: socket.id
            });

            socket.emit('server_send_successful_registration_to_new_client', {
                username: username,
                id: socket.id
            });

            listUser.push(username);
            listId.push(socket.id);
	        
	    });

	    socket.on('client_send_messages', (data) => {
	        io.sockets.emit('server_send_messages_to_another_client', {
	            message: data.message,
	            username: socket.username,
	            id: data.id
	        });
	    });
	});
};