'use strict';
var hostname = location.protocol + '//' + location.host;
// console.log(hostname);
var socket = io(hostname); // jshint ignore:line
var myId = -1;
var myUsername = "";

//client receive from server
socket.on('server_send_register_fail',  (data) => {
    alert(data + " already exists");
});

socket.on('server_send_successful_registration_to_new_client',  (data) => {
    $("#box-chat").show();
    $("#box-rigister").remove();
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
    let noti = '<div class="color-gray notification">' + data.username + ' join the conversation</div>';
    $("#box-message").append(noti);
    scroll();
    // }
});

socket.on('server_send_messages_to_another_client',  (data) => {
	// alert(data.username);
	if (idNotJoin()) {
		return;
	}
	if (myUsername === data.username) {
		let s = '<div class="message my-message">' + data.message + '</div>';
        $("#box-message").append(s);
        scroll();
        return;
	}
	// if (myId !== data.id) {
    let s = '<div class="friend-name">' + data.username + '</div>' +
        '<div class="message friend-message">' + data.message + '</div>';
    $("#box-message").append(s);
    new Audio('mp3/chat.mp3').play();
    scroll();
    // }
});

// socket.on("server_send_buzz",  (data) => {
//     new Audio('mp3/buzz.mp3').play();
//     var noti = "<div class='color-red notiphongchat clear'>" + data + " vừa buzz bạn</div>";
//     $("#box-message").append(noti);
//     scroll();
// })

socket.on('server_send_a_client_has_left', (data) => {
	if (idNotJoin()) {
		return;
	}
    // if (myUsername !== data.username) {
	var s = Number($("#number-user-online").html());
    s--;
    $("#number-user-online").html(s);
    var n = "#" + data.id;
    $(n).hide();
    var noti = '<div class="color-gray notification">' + data.username + ' has left</div>';
    $("#box-message").append(noti);
    scroll();
    // }
});

//client send to server
$(document).ready(() => {
	$(window).on('resize', () => {
		if ($(this).width() >= 768) {
			$('#left').show();
		}
	});
    // $(window).on('resize', () => {
    //     var height = $(this).height() - 120;
    //     $("#box-message").height(height);
    //     scroll();
    // }).trigger('resize');

    $("#box-chat").hide();

    $("#btnRegister").click(() => {
        var username = $("#username").val();
        username = username.trim();
        if (username !== "") {
            socket.emit('client_send_register', username);
        } else {
            $("#username").val("");
        }
    });

    $("#btnSend").click(() => {
        var message = $("#input-message").val();
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

// $(document).on("click", ".list-group-item", () {
//     var targetId = $(this).attr("id");
//     if (targetId != myid) {
//         socket.emit("client_buzz_another_client", targetId);
//         new Audio('mp3/buzz.mp3').play();
//         var noti = "<div class='color-red notification'> Bạn vừa buzz " + $(this).html() + "</div>";
//     	$("#box-message").append(noti);
//     }

// })

//anohter fuction
function scroll() {
    $("#box-message").scrollTop($("#box-message").prop("scrollHeight"));
}

function idNotJoin() {
	return myId === -1;
}