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

let getListRoom = () => {
    return listAllRoom.map((room) => {
        let {messages, listUser, ...roomFiltered} = room;
        return {
            ...roomFiltered, countUser: listUser.length
        };
    });
};

let getListMessages = (roomid) => {
    let length = listAllRoom.length;
    for (let i = 0; i < length; i++) {
        if (listAllRoom[i].roomid === roomid) {
            return listAllRoom[i].messages;
        }
    }
    return [];
};

let saveMessage = (roomid, objMessage) => {
    let length = listAllRoom.length;
    for (let i = 0; i < length; i++) {
        if (listAllRoom[i].roomid === roomid) {
            listAllRoom[i].messages.push(objMessage);
            return;
        }
    }
};

let updateSrcForMessage = (roomid, time, src) => {
    // console.log(time);
    // console.log(src);

    let length = listAllRoom.length;
    for (let i = 0; i < length; i++) {
        if (listAllRoom[i].roomid === roomid) {
            for (let j = listAllRoom[i].messages.length - 1; j >= 0; j--) {
                let mess = listAllRoom[i].messages[j];
                // console.log(mess);
                if (mess.type === "image" && mess.time === time) {
                    mess.src = src;
                }
            }
            return;
        }
    }
}

let getRoomNameById = (roomid) => {
    let i = checkRoomExists(roomid);
    return i == -1 ? 'Undefined' : listAllRoom[i].roomname;
};

let getListRoomOfUser = (username) => {
    let listRoom = [];
    let numRoom = listAllRoom.length;
    for (let i = 0; i < numRoom; i++) {
        for (let j = listAllRoom[i].length - 1; j >= 0; j--) {
            if (listAllRoom[i].listUser[j].username === username) {
                listRoom.push(listAllRoom[i]);
                break;
            }
        }
    }
    return listRoom;
};

let checkUserExists = (roomid, username) => {
    let index = checkRoomExists(roomid);
    if (index === -1) {
        return false;
    }
    for (let i = listAllRoom[index].listUser.length - 1; i >= 0; i--) {
        if (listAllRoom[index].listUser[i].username === username) {
            return true;
        }
    }
    return false;
};

let getListUserOfRoom = (index) => {
    return [...listAllRoom[index].listUser];
};

let pushRoom = (room) => {
    listAllRoom.push(room);
};

let pushUserToRoom = (index, user) => {
    if (index < 0 || index >= listAllRoom.length) {
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
    if (index === -1) {
        return false;
    }
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

const getUserInfoInRoom = (roomid, username) => {
    const index = checkRoomExists(roomid);
    if (index === -1) return {};
    const listUser = getListUserOfRoom(index);
    for (let i = listUser.length - 1; i >= 0; i--) {
        if (listUser[i].username === username) {
            return listUser[i];
        }
    }
    return {};
};
module.exports = {
    checkRoomExists,
    getListRoom,
    getRoomNameById,
    getListRoomOfUser,
    checkUserExists,
    getListUserOfRoom,
    pushRoom,
    pushUserToRoom,
    addUserInRoom,
    removeAUserInRoom,
    getUserInfoInRoom,
    getListMessages,
    saveMessage,
    updateSrcForMessage
};
