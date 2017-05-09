'use strict';
var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//body-parser for get data from post form
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set template ejs, static folder
app.set('views', './apps/views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));

//controller for define route
var controllers = require('./apps/controllers');
app.use(controllers);

// var host = config.get('server.host');
var port = config.get('server.port');
server.listen(process.env.PORT || port, () => {
	console.log('Server running on PORT ' + port);
});

var listUser = [];
var listId =[];
io.on('connection', (socket) => {

	console.log('A client was connected, id = ' + socket.id);

	socket.on('disconnect', () => {
		let i = listId.indexOf(socket.id);
        io.sockets.emit('server_send_a_client_has_left', {
        	username: listUser[i],
        	id: socket.id
        });
        listUser.splice(i, 1);
        listId.splice(i, 1);
    });

    socket.on("client_send_register", (data) => {
        if (listUser.indexOf(data) >= 0) {
            socket.emit("server_send_register_fail", data);
        } else {
        	socket.emit("server_send_all_client_online_to_new_client", { //kết nối vào là gửi danh sách người đang online
		        username: listUser,
		        id: listId
		    });

            listUser.push(data);
            listId.push(socket.id);

            socket.emit("server_send_successful_registration_to_new_client", {
                username: data,
                id: socket.id
            });

            io.sockets.emit("server_send_new_user_to_another_user", {
                username: data,
                id: socket.id
            });
        }
    });

    socket.on("client_send_messages", (data) => {
        io.sockets.emit("server_send_messages_to_another_client", {
            message: data.message,
            username: data.username,
            id: data.id
        });
    });
});
