'use strict';

let hostname = location.protocol + '//' + location.host;
let socket = io(`${hostname}/list-room`); // jshint ignore:line

socket.on('send-list-room', (listRoom) => {
  listRoom.forEach((room) => {
    let s = `
				<a href="/room/${room.roomid}">
					<div class="chat_room">
						<img src="${room.roomimage}" alt="${room.roomname}">
					<div class="crop">
						<b title="${room.roomname}">${room.roomname}</b>
						<br>
						Online <span class="text-muted" id="${room.roomid}">${room.listUser.length}</span>
						</div>
					</div>
				</a>
			`;
    $('.container').append(s);
  });
});

socket.on('new-room-created', (room) => {
  let s = '<a href="/room/' + room.roomid + '"><div class="chat_room"><img src="' + room.roomimage + '" alt="' + room.roomname + '"><div class="crop"><b title="' + room.roomname + '">' + room.roomname + '</b><br>Online <span class="text-muted" id="' + room.roomid + '">0</span></div></div></a>';
  $('.container').append(s);
});

let online = (roomid, aFlag) => {
  let s = Number($("#" + roomid).text());
  s = s + aFlag;
  $("#" + roomid).text(s);
};

socket.on('a-user-joined-room', (roomid) => {
  online(roomid, 1);
});

socket.on('a-user-leaved-room', (roomid) => {
  online(roomid, -1);
});
