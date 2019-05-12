'use strict';
// let helper = require('../helpers/helper');
module.exports = (server) => {
    let io = require('socket.io')(server);

    let listAllRoom = require('./list-all-room');
    let listInCall = require('./list-in-call');

    let nsRoom = io.of('/room');
    let nsCall = io.of('/call');
    let nsListRoom = io.of('/list-room');

    let addZero = (number) => {
        return number < 10 ? `0${number}` : number;
    };

    let socketMiddleware = (socket, next) => {
        let token = socket.request.query.token;
        if (isValid(token)) {
            return next();
        }
        return next(new Error('authentication error'));
    };

    nsRoom.use((socket, next) => {
        console.log("middle");
        // if (socket.handshake.query.token === '123') return next();
        // next(new Error('Authentication error'));
        next();
    });

    // nsCall.use(socketMiddleware());

    nsCall.on('connection', (socket) => {
        console.log('someone connected nsCall, id = ', socket.id);

        socket.on('CALL_ME_TO', (data) => {
            let check = false;
            let mess = '';
            if (listInCall.checkUserInCall(data.username)) {
                check = true;
                mess += data.name + ' đang trong cuộc gọi khác\n';
            }
            if (listInCall.checkUserInCall(data.target.username)) {
                check = true;
                mess += data.target.name + ' đang trong cuộc gọi khác';
            }
            if (check) {
                socket.emit('CANNOT_CALL_NOW', mess);
                return;
            }
            const {username, name, roomid, target} = data;
            listInCall.pushUser(username);
            listInCall.pushUser(target.username);
            socket.name = name;
            socket.target = target;
            socket.roomid = roomid;
            socket.username = username;
            nsRoom.to(roomid).emit('A_USER_CALLING', data);
        });

        socket.on('ADD_ME_TO_LIST_IN_CALL', (data) => {
            const {username, name, roomid, target} = data;
            listInCall.pushUser(username);
            listInCall.pushUser(target.username);
            socket.name = name;
            socket.target = target;
            socket.roomid = roomid;
            socket.username = username;
        });

        socket.on('disconnect', (data) => {
            const {username, name, roomid, target} = socket;
            username ? listInCall.removeUser(username) : null;
            target ? listInCall.removeUser(target.username) : null;
            nsRoom.to(roomid).emit('A_USER_ENDCALL', {name, target});
        });

        socket.on('USER_CANCEL_CALL', (data) => {
            nsCall.emit('USER_CANCEL_CALL', data);
        });
    });

    // nsListRoom.use(socketMiddleware());

    nsListRoom.on('connection', (socket) => {
        console.log('someone connected nsListRoom, id = ', socket.id);

        socket.emit('send-list-room', listAllRoom.getListRoom());
        socket.on('create-room', (room) => {
            nsListRoom.emit('new-room-created', room);
            nsRoom.emit('new-room-created', room);
            socket.emit('created');
        });
    });

    // nsRoom.use(socketMiddleware());

    nsRoom.on('connection', (socket) => {
        console.log('someone connected nsRoom, id = ', socket.id);

        socket.on('disconnect', () => {
            if (listAllRoom.removeAUserInRoom(socket.roomid, socket.username)) {
                nsRoom.to(socket.roomid).emit('a-user-disconnected', {
                    username: socket.username,
                    name: socket.name
                });
                nsListRoom.emit('a-user-leaved-room', socket.roomid);
                nsRoom.emit('a-user-leaved-room', socket.roomid);
            }
        });

        socket.on('connect-me-to-room', (data) => {
            socket.roomid = data.roomid;
            socket.username = data.username;
            socket.name = data.name;
            socket.fbid = data.fbid;

            let exists = listAllRoom.checkUserExists(data.roomid, data.username);
            let i = listAllRoom.checkRoomExists(data.roomid);

            let user = {
                username: socket.username,
                name: socket.name,
                fbid: data.fbid,
                count: 1
            };

            if (exists) {
                listAllRoom.addUserInRoom(i, user);
            } else {
                listAllRoom.pushUserToRoom(i, user);
            }

            data.listUser = listAllRoom.getListUserOfRoom(i); //for right side bar

            data.listRoom = listAllRoom.getListRoom(); //for left side bar

            data.listMessages = listAllRoom.getListMessages(data.roomid);

            socket.join(data.roomid, () => {
                socket.emit('connect-successfully', data);
                if (!exists) {
                    socket.broadcast.to(data.roomid).emit('a-user-connected', user);
                    nsListRoom.emit('a-user-joined-room', data.roomid);
                    socket.emit('a-user-leaved-room', data.roomid);
                    nsRoom.emit('a-user-joined-room', data.roomid);
                }
            });
        });

        socket.on('user-send-messages', (message) => {
            let date = new Date();
            let time = date.getTime();
            let timeSent = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
            let objMessage = {
                type: 'message',
                username: socket.username,
                name: socket.name,
                time,
                timeSent,
                fbid: socket.fbid,
                message,
                src: "",
            };
            listAllRoom.saveMessage(socket.roomid, objMessage);
            nsRoom.to(socket.roomid).emit('someone-send-message', objMessage);
        });

        socket.on('user-send-image', (time) => {
            let date = new Date();
            let timeSent = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
            let objImg = {
                type: 'image',
                username: socket.username,
                name: socket.name,
                time,
                timeSent,
                fbid: socket.fbid,
                message: "",
                src: "/images/img_trans.gif",
            };
            listAllRoom.saveMessage(socket.roomid, objImg);
            nsRoom.to(socket.roomid).emit('someone-send-image', objImg);
        });

        socket.on('update-src-for-image', (data) => {
            // console.log(data);
            listAllRoom.updateSrcForMessage(socket.roomid, data.time, data.link);
            nsRoom.to(socket.roomid).emit('update-src-for-image', data);
        });

        socket.on('USER_CANCEL_CALL', (data) => {
            nsCall.emit('USER_CANCEL_CALL', data);
        });
    });
};
