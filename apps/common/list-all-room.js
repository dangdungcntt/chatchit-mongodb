'use strict';
let listAllRoom = [];

let checkRoomExists = (roomid) => {
	let length = listAllRoom.length;
	for (let i = 0; i < length; i++) {
		if (listAllRoom[i].roomid === roomid) {
			return i;
		}
	}
	return -1;
}; 

let checkUserExists = (roomid, username) => {
	let index = checkRoomExists(roomid);
	if (index === -1) { return false; }
	for (let i = listAllRoom[index].listUser.length - 1; i >= 0; i--) {
		if (listAllRoom[index].listUser[i].username === username) {
			return true;
		}
	}
	return false;
};

let getListUserOfRoom = (index) => {
	return listAllRoom[index].listUser.slice(0);
};

let pushRoom = (room) => {
	listAllRoom.push(room);
};

let pushUserToRoom = (index, user) => {
	if (index < 0 || index >= listAllRoom.lenth) {
		return false;
	}
	listAllRoom[index].listUser.push(user);
	return true;
};

let addUserInRoom = (index, user) => {
	for (let i = listAllRoom[index].listUser.length - 1; i >= 0; i--) {
		if (user.username === listAllRoom[index].listUser[i].username) {
			listAllRoom[index].listUser[i].count++;
		}
	}
};

let removeAUserInRoom = (roomid, username) => {
	let index = checkRoomExists(roomid);
	if (index === -1) { return false; }
	for (let i = listAllRoom[index].listUser.length - 1; i >= 0; i--) {
		let user = listAllRoom[index].listUser[i];
		if (user.username === username) {
			if (user.count > 1) {
				user.count--;
				return false;
			} else {
				listAllRoom[index].listUser.splice(i, 1);
				return true;
			}
		}
	}
	return false;

};
module.exports = {
	checkRoomExists,
	checkUserExists,
	getListUserOfRoom,
	pushRoom,
	pushUserToRoom,
	addUserInRoom,
	removeAUserInRoom
};
