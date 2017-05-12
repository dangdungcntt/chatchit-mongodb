'use strict';

let scrollBox = () => {
    $("#box-message").scrollTop($("#box-message").prop("scrollHeight"));
};

let idNotJoin = () => {
    return myId === -1;
};

let hostname = location.protocol + '//' + location.host;
// console.log(hostname);
let socket = io(hostname); // jshint ignore:line
let myId = -1;
let myUsername = "";
let chatSound = new Audio('/mp3/chat.mp3');

//client receive from server
socket.on('server_send_register_fail',  (data) => {
    alert(data + " already exists");
});

socket.on('server_send_registered', () => {
    alert('An error occurs');
    location.href = '/';
});

socket.on('server_send_successful_registration_to_new_client',  (data) => {
    $("#box-chat").show();
    // $("#box-register").remove();
    $("#input-message").focus();
    myId = data.id;
    myUsername = data.username;
    $("#display-user-name").html(myUsername);
});

socket.on('server_send_all_client_online_to_new_client', (data) => {
	let numberUser = data.username.length;
    for (let i = 0; i < numberUser; i++) {
        $("#list-user-online").append('<a class="btn gray-color item-user-online" title="' + data.username[i] + '" id="' + data.id[i] + '">' + data.username[i] + '</a>');
    }
    $("#number-user-online").html(data.username.length);
});

socket.on('server_send_new_user_to_another_user', (data) => {
	if (idNotJoin()) {
		return;
	}
    // if (data.id !== myId && data.username !== myUsername) {
    let s = Number($("#number-user-online").html());
    s++;
    $("#number-user-online").html(s);
    $("#list-user-online").append('<a class="btn gray-color item-user-online" title="' + data.username + '" id="' + data.id + '">' + data.username + '</a>');
    let noti = '<div class="color-gray notification">' + data.username + ' has joined the conversation.</div>';
    $("#box-message").append(noti);
    scrollBox();
    // }
});

socket.on('server_send_messages_to_another_client',  (data) => {
	// alert(data.username);
	if (idNotJoin()) {
		return;
	}
	if (myUsername === data.username) {
        // let s = '<div class="message my-message">' + data.message + '</div>';
		let s = '<div class="message my-message" id="create_by_dangdungcntt"></div>';
        $("#box-message").append(s);
        $("#create_by_dangdungcntt").text(data.message);
        $("#create_by_dangdungcntt").removeAttr('id');
        scrollBox();
        return;
	}
	// if (myId !== data.id) {
    let s = '<div class="friend-name">' + data.username + '</div>' +
        '<div class="message friend-message">' + data.message + '</div>';
    $("#box-message").append(s);
    chatSound.play();
    scrollBox();
    // }
});



socket.on('server_send_a_client_has_left', (data) => {
	if (idNotJoin()) {
		return;
	}
    // if (myUsername !== data.username) {
	let s = Number($("#number-user-online").html());
    s--;
    $("#number-user-online").html(s);
    let n = "#" + data.id;
    $(n).remove();
    let noti = '<div class="color-gray notification">' + data.username + ' has left.</div>';
    $("#box-message").append(noti);
    scrollBox();
    // }
});

//client send to server
$(document).ready(() => {
	$(window).on('resize', () => {
		if ($(this).width() >= 768) {
			$('#left').show();
		}
	});
    $(window).on('resize', () => {
        let height = $(this).height() - 103;
        $("#box-message").height(height);
        scrollBox();
    }).trigger('resize');

    $("#box-chat").hide();

    $("#btnSend").click(() => {
        let message = $("#input-message").val();
        message = message.trim();
        if (message !== '') {
        	socket.emit('client_send_messages', {id: myId, username: myUsername, message: message});
        }
        $("#input-message").val('');
        
    });

    $("#username").keyup((event) => {
        if (event.keyCode === 13) {
            $("#btnRegister").click();
        }
    });

    $("#input-message").keyup((event) => {
        if (event.keyCode === 13) {
            $("#btnSend").click();
        }
    });
});
