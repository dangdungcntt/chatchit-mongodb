let hostname = `${location.protocol}//${location.host}`;
let socket = io(`${hostname}/room`); // jshint ignore:line

let addZero = (number) => {
  return number < 10 ? `0${number}` : number;
};

let itsMe = (username) => {
  return username === socket.username;
};

let getUrlAvatar = (fbid, w = 40, h = 40) => {
  if (fbid !== '') {
    return `https://graph.facebook.com/${fbid}/picture?type=large&redirect=true&width=${w}&height=${h}`;
  } else {
    return '/images/default_avatar.jpg';
  }
};

let checkFile = (file) => {
  if (file.size > 5242880) {
    alert('Max image size is 5MB');
    return false;
  }
  if (!file.type.includes('image')) {
    alert('Only image file');
    return false;
  }
  return true;
};

let uploadFile = (e) => {
  let file = e.target.files[0];
  if (checkFile(file)) {
    let time = new Date().getTime();
    socket.emit('user-send-image', time);
    let formData = new FormData();
    formData.append("image", file);
    $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'POST',
        headers: {
          "Authorization": "Client-ID c495b49b842a03e"
        },
        data: formData,
        cache: false,
        dataType: 'json',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell 
      })
      .then((resUpload) => {
        socket.emit('update-src-for-image', {
          time,
          link: resUpload.data.link
        });
      })
      .catch((err) => { //jshint ignore: line
        // console.log(err);
        alert('Cannot upload file');
      });
  }
};

let checkSize = (width) => {
  if (width < 1000) {
    $('.btn-slide-left').css('visibility', '');
    $('.btn-slide-right').css('visibility', '');
    if (sttRight) { //dang mo?
      $('.btn-slide-right').click();
    }
  } else {
    $('.btn-slide-left').css('visibility', 'hidden');
    $('.btn-slide-right').css('visibility', 'hidden');
    if (!sttRight) { //dang dong'
      $('.btn-slide-right').click();
    }
  }
  if (width < 700) {
    if (sttLeft) { //dang mo?
      $('.btn-slide-left').click();
    }
  } else {
    if (!sttLeft) { //dang dong'
      $('.btn-slide-left').click();
    }
  }
};

const scrollBox = () => {
  $("#box-message").scrollTop($("#box-message").prop("scrollHeight"));
};

let online = (roomid, aFlag) => {
  let s = Number($(`#online${roomid}`).text());
  s = s + aFlag;
  $(`#online${roomid}`).text(s);
};

let appendDataForMe = (data, s1, s2, lastMess) => {
  if (lastMess.hasClass('box-my-messages')) {
    lastMess.children().append(s1);
    $("#chatchit").text(data.message);
    $("#chatchit").removeAttr('id');
  } else {
    $("#box-message").append(s2);
    $("#chatchit").text(data.message);
    $("#chatchit").removeAttr('id');
  }
};

let appendDataForFriend = (data, s1, s2, lastMess) => {
  if (lastMess.attr('sender') === data.username) {
    lastMess.children('.friend-messages').append(s1);
    $("#chatchit").text(data.message);
    $("#chatchit").removeAttr('id');
  } else {
    $("#box-message").append(s2);
    $("#chatchit").text(data.message);
    $("#chatchit").removeAttr('id');
  }
};

//fuction for video call
const fillModalCalling = (fbid, name) => {
  $('#modalCalling .avatar').attr('src', getUrlAvatar(fbid));
  $('#modalCalling .modal-body b').text(name);
};
