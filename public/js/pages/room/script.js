'use strict';
let chatSound = new Audio('/mp3/chat.mp3');
let joinroomSound = new Audio('/mp3/joinroom.mp3');
let callingSound = new Audio('/mp3/calling.mp3');

socket.emit('connect-me-to-room', data);

socket.on('connect-successfully', (data) => {
  socket.username = data.username;
  socket.roomid = data.roomid;
  data.listUser.forEach((user) => {
    if (itsMe(user.username)) {
      return;
    }
    let s = `
				<a href="#" id="${user.username}" class="list-user-item" title="${user.name}">
					<div class="user-avatar">
						<img width="32" height="32" src="${getUrlAvatar(user.fbid)}">
					</div>
					<div class="user-info">
						<div class="user-name">${user.name}</div>
						<div class="user-status">Online</div>
					</div>
				</a>
			`;
    $('.list-user').append(s);
  });
  data.listRoom.forEach((room) => {
    let s = `
				<a href="/room/${room.roomid}" class="list-room-item" title="${room.roomname}">
					<div class="room-logo">
						<img src="${room.roomimage}">
					</div>
					<div class="room-info">
						<div class="room-name">${room.roomname}</div>
						<div class="room-id">${room.roomid}</div>
						<div class="room-detail">
							Online <span id="online${room.roomid}">${room.listUser.length}</span>
						</div>
					</div>
				</a>
			`;
    $('#list-room').append(s);
  });
  $('.loading').fadeOut(500, () => {
    $('.container').slideDown(600);
    setTimeout(() => {
      checkSize($(window).width());
    }, 1000);
  });
  socket.username = data.username;
});

socket.on('a-user-connected', (user) => {
  if (itsMe(user.username)) {
    return;
  }
  joinroomSound.play();
  let show = '';
  if (!sttRight) {
    show = 'style="display: none;"';
  }
  let s = `
			<a href="#" id="${user.username}" class="list-user-item">
				<div class="user-avatar">
					<img width="32" height="32" src="${getUrlAvatar(user.fbid)}">
				</div>
				<div ${show} class="user-info">
					<div class="user-name">${user.name}</div>
					<div class="user-status">Online</div>
				</div>
			</a>
		`;
  $('.list-user').append(s);
});

socket.on('a-user-disconnected', (user) => {
  $(`#${user.username}`).remove();
});

socket.on('someone-send-message', (data) => {
  let lastMess = $('.wrapper-messages:last-child');
  let date = new Date();
  let timeSent = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
  if (itsMe(data.username)) {
    let s1 = `<div id="chatchit" class="message my-color" title="${timeSent}"></div>`;
    let s2 = `
					<div class="wrapper-messages my-wrapper-messages box-my-messages clearfix">
						<div class="my-messages">
							${s1}
						</div>
					</div>
				`;
    appendDataForMe(data, s1, s2, lastMess);
    scrollBox();
    return;
  }
  let s1 = `<div id="chatchit" class="message friend-color" title="${timeSent}"></div>`;
  let s2 = `
			<div sender="${data.username}" class="wrapper-messages box-friend-messages clearfix">
				<div class="friend-name">${data.name}</div>
				<div class="friend-avatar">
					<img class="avatar" src="${getUrlAvatar(data.fbid)}" />
				</div>
				<div class="friend-messages">
					${s1}
				</div>
			</div>
		`;
  appendDataForFriend(data, s1, s2, lastMess);
  chatSound.play();
  scrollBox();
});

socket.on('someone-send-image', (data) => {
  let lastMess = $('.wrapper-messages:last-child');
  let date = new Date();
  let timeSent = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
  if (itsMe(data.username)) {
    let s1 = `<img id="${data.time}" class="message message-image my-image" src="/images/img_trans.gif" alt="image" title="${timeSent}" />`;
    let s2 = `
				<div class="wrapper-messages my-wrapper-messages box-my-messages clearfix">
					<div class="my-messages">
						${s1}
					</div>
				</div>
			`;
    appendDataForMe(data, s1, s2, lastMess);
    scrollBox();
    return;
  }
  let s1 = `<img id="${data.time}" class="message message-image" src="/images/img_trans.gif" alt="image" title="${timeSent}" />`;
  let s2 = `
			<div sender="${data.username}" class="wrapper-messages box-friend-messages clearfix">
				<div class="friend-name">${data.name}</div>
				<div class="friend-avatar">
					<img class="avatar" src="${getUrlAvatar(data.fbid)}">
				</div>
				<div class="friend-messages">
					${s1}
				</div>
			</div>
		`;
  appendDataForFriend(data, s1, s2, lastMess);
  scrollBox();
});

socket.on('update-src-for-image', (data) => {
  let targetImage = $(`#${data.time}`);
  targetImage.css('background', 'none');
  targetImage.attr('src', data.link);
  targetImage.removeAttr('id');
  if (!targetImage.hasClass('my-image')) {
    chatSound.play();
  }
  targetImage.on('load', () => {
    setTimeout(() => {
      scrollBox();
    }, 500);
  })

});

socket.on('new-room-created', (room) => {
  let show = '';
  if (!sttLeft) {
    show = 'style="display: none;"';
  }
  let s = `
			<a href="/room/${room.roomid}" class="list-room-item">
				<div class="room-logo">
					<img src="${room.roomimage}">
				</div>
				<div ${show} class="room-info">
					<div class="room-name">${room.roomname}</div>
					<div class="room-id">${room.roomid}</div>
					<div class="room-detail">
						Online <span id="online${room.roomid}">0</span>
					</div>
				</div>
			</a>
		`;
  $('#list-room').append(s);
});

socket.on('a-user-joined-room', (roomid) => {
  online(roomid, 1);
});

socket.on('a-user-leaved-room', (roomid) => {
  online(roomid, -1);
});

let sttLeft = true;
let sttRight = true;

$(document).ready(() => {
  //send to server
  $("#btnSend").click(() => {
    $('#popupEmoji').hide();
    let message = $("#input-message").val();
    message = message.trim();
    if (message !== '') {
      socket.emit('user-send-messages', message);
    }
    $("#input-message").val('');
  });

  $("#input-message").keyup((event) => {
    if (event.keyCode === 13) {
      $("#btnSend").click();
    }
  });

  //layout
  $(window).on('resize', () => {
    checkSize($(this).width());
    let height = $(this).height() - 103;
    $("#box-message").height(height);
    scrollBox();
  });

  $('.btn-slide-left').click(() => {
    if ($(window).width() > 1000 && sttLeft) {
      return;
    }
    if (sttLeft) {
      $('.list-room-title').hide(400);
      $('.room-info').hide(400);
      $('.btn-slide-left').css('background-position', '-40px 0');
      $('.left').animate({
        'width': 70
      }, 400);
      $('.center').animate({
        'margin-left': 71
      }, 400);
    } else {
      if (sttRight && $(window).width() < 600) {
        $('.btn-slide-right').click();
      }
      $('.btn-slide-left').css('background-position', '0 0');
      $('.center').animate({
        'margin-left': 251
      }, 400);
      $('.left').animate({
        'width': 250
      }, 400);
      setTimeout(() => {
        $('.list-room-title').show(200);
        $('.room-info').show(200);
      }, 350);

    }
    sttLeft = !sttLeft;
  });

  $('.btn-slide-right').click(() => {
    if ($(window).width() > 1000 && sttRight) {
      return;
    }
    if (sttRight) {
      $('.list-user-title').hide(600);
      $('.user-info').hide(600);
      $('.btn-slide-right').css('background-position', '0 0');
      $('.right').animate({
        'width': 50
      }, 'slow');
      $('.center').animate({
        'margin-right': 52
      }, 'slow');
    } else {
      if (sttLeft && $(window).width() < 600) {
        $('.btn-slide-left').click();
      }
      $('.btn-slide-right').css('background-position', '-40px 0');
      $('.right').animate({
        'width': 250
      }, 'slow');
      $('.center').animate({
        'margin-right': 253
      }, 'slow');
      setTimeout(() => {
        $('.list-user-title').show(200);
        $('.user-info').show(200);
      }, 300);
    }
    sttRight = !sttRight;
  });

  $('#btnEmoji').click(() => {
    $('#popupEmoji').toggle();
    $('.tab-emoji-selected').click();
  });

  $(document).on('click', 'a.emoji-item', (e) => {
    $('#input-message').val($('#input-message').val() + $(e.target).text());
    $('#input-message').focus();
  });

  $('.tab-emoji-item').click(() => {
    let emojiType = $(this).attr('emoji-type');
    $('.tab-emoji-selected').removeClass('tab-emoji-selected');
    $('.emoji-type-selected').removeClass('emoji-type-selected');
    $(this).addClass('tab-emoji-selected');
    if ($(`#${emojiType}`).length) { //da co noi dung
      $(`#${emojiType}`).addClass('emoji-type-selected');
    } else { //chua co
      $('.content-popupEmoji').css('background', "url('/images/loading-emoji.gif') center center no-repeat");
      $.ajax({
          url: '/api/list-emoji',
          type: 'post',
          data: {
            emojiname: $(this).attr('emoji-type')
          },
          dataType: 'json'
        })
        .then((res) => { //res is an array
          // console.log(res);
          let typeEmoji = res[0];
          $('.content-popupEmoji').append(`<div id="${typeEmoji.name}" class="emoji-type-content emoji-type-selected">`);
          $('.content-popupEmoji').css('background', 'none');
          typeEmoji.list.forEach((emoji) => {
            $(`#${typeEmoji.name}`).append(`<a class="emoji-item" title="${emoji.name}">${emoji.value}</a>`);
          });

        })
        .catch((err) => {
          alert(err);
        });
    }
  });

  $('#chooseImage').on('change', uploadFile);

  //script for video call
  $('.list-user.scroll-bar').on('click', '.list-user-item', (e) => {
    const targetUsername = $(e.target).closest('.list-user-item').attr('id');
    const popupWindow = openPopupCenter(
      `/call/${socket.roomid}/${targetUsername}`,
      800, 450
    );
    popupWindow.focus(); return false;
  })

  socket.on('A_USER_CALLING', (data) => {
    const {
      username, fbid, name, target, roomid, callerId
    } = data;
    if (itsMe(target.username)) {
      fillModalCalling(fbid, name);
      callingSound.loop = true;
      callingSound.play();
      $('#modalCalling').show();
      $('.modal-footer #btnAnswer').on('click', () => {
        callingSound.pause();
        $('#modalCalling').hide();
        const popupWindow = openPopupCenter(
          `/call/${roomid}/${username}/${callerId}`,
          800, 450
        );
        popupWindow.focus(); return false;
      });
      $('.modal-footer #btnCancel').on('click', () => {
        callingSound.pause();
        $('#modalCalling').hide();
        socket.emit('USER_CANCEL_CALL', data);
      });
    }
  });
  socket.on('A_USER_ENDCALL', (data) => {
    const {
      target, name
    } = data;
    if (itsMe(target.username)) {
      if (($('#modalCalling').css('display') === 'block')) {
        $('.modal-footer #btnCancel').click();
        alert('Bạn đã lỡ 1 cuộc gọi từ ' + name);
      }
    }
  });
});



