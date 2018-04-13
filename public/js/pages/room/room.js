class User {
    constructor({username, name, fbid}) {
        this.username = username;
        this.name = name;
        this.fbid = fbid;
    }

    render() {
        return `
      <a href="#" id="${this.username}" class="list-user-item" title="${this.name}">
        <div class="user-avatar">
          <img width="32" height="32" src="${getUrlAvatar(this.fbid)}">
        </div>
        <div class="user-info">
          <div class="user-name">${this.name}</div>
          <div class="user-status">Online</div>
        </div>
      </a>
    `;
    }
}

class Room {
    constructor({roomid, roomname, roomimage, countUser}) {
        this.roomid = roomid;
        this.roomname = roomname;
        this.roomimage = roomimage;
        this.countUser = countUser;
    }

    render() {
        return `
      <a href="/room/${this.roomid}" class="list-room-item" title="${this.roomname}">
        <div class="room-logo">
          <img src="${this.roomimage}">
        </div>
        <div class="room-info">
          <div class="room-name">${this.roomname}</div>
          <div class="room-id">${this.roomid}</div>
          <div class="room-detail">
            Online <span id="online${this.roomid}">${this.countUser}</span>
          </div>
        </div>
      </a>
    `;
    }
}

class Message {
    constructor({username, name, time, timeSent, fbid, message, src}) {
        this.username = username;
        this.name = name;
        this.time = time;
        this.timeSent = timeSent;
        this.fbid = fbid;
        this.message = message;
        this.src = src;
        this.loaded = src !== "/images/img_trans.gif" ? "loaded" : "";
    }

    render() {
        return `<div id="chatchit" class="message my-color" title="${this.timeSent}"></div>`;
    }

    imgRender() {
        return `<img id="${this.time}" class="message message-image my-image ${this.loaded}" src="${this.src}" alt="image" title="${this.timeSent}" />`;
    }

    wrapRender(mess) {
        return `
      <div class="wrapper-messages my-wrapper-messages box-my-messages clearfix">
        <div class="my-messages">
          ${mess}
        </div>
      </div>
    `;
    }

    friendRender() {
        return `<div id="chatchit" class="message friend-color" title="${this.timeSent}"></div>`
    }

    friendImgRender() {
        return `<img id="${this.time}" class="message message-image loaded" src="${this.src}" alt="image" title="${this.timeSent}" />`;
    }

    friendWrapRender(mess) {
        return `
    <div sender="${this.username}" class="wrapper-messages box-friend-messages clearfix">
      <div class="friend-name">${this.name}</div>
      <div class="friend-avatar">
        <img class="avatar" src="${getUrlAvatar(this.fbid)}" />
      </div>
      <div class="friend-messages">
        ${mess}
      </div>
    </div>
  `;
    }
}

let hostname = `${location.protocol}//${location.host}`;
let socket = io(`${hostname}/room`); // jshint ignore:line

let =
retrieveImageFromClipboardAsBlob = (pasteEvent, callback) => {
    if (pasteEvent.clipboardData == false) {
        if (typeof (callback) == "function") {
            callback(undefined);
        }
    }
    ;

    var items = pasteEvent.clipboardData.items;

    if (items == undefined) {
        if (typeof (callback) == "function") {
            callback(undefined);
        }
    }
    ;

    for (var i = 0; i < items.length; i++) {
        // Skip content if not image
        if (items[i].type.indexOf("image") == -1) continue;
        // Retrieve image on clipboard as blob
        var blob = items[i].getAsFile();

        if (typeof (callback) == "function") {
            callback(blob);
        }
    }
}

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

let uploadFile = (file) => {
    if (checkFile(file)) {
        let time = new Date().getTime();
        socket.emit('user-send-image', time);
        let formData = new FormData();
        formData.append("image", file);
        $.ajax({
                url: baseAPIUpImg + '/image',
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

// let myMessTemplate = (timeSent) => {
//   return `<div id="chatchit" class="message my-color" title="${timeSent}"></div>`;
// }

// let myImgTemplate = ({time, timeSent, src}) => {
//   return `<img id="${time}" class="message message-image my-image" src="${src}" alt="image" title="${timeSent}" />`;
// }

// let myWrapMessTemplate = (message) => {
//   return `
//     <div class="wrapper-messages my-wrapper-messages box-my-messages clearfix">
//       <div class="my-messages">
//         ${message}
//       </div>
//     </div>
//   `
// }

// let friendMessTemplate = (timeSent) => {
//   return `<div id="chatchit" class="message friend-color" title="${timeSent}"></div>`
// }

// let friendImgTemplate = ({time, timeSent, src}) => {
//   return `<img id="${time}" class="message message-image" src="${src}" alt="image" title="${timeSent}" />`;
// }

// let friendWrapMessTemplate = ({username, name, fbid}, message) => {
//   return `
//     <div sender="${username}" class="wrapper-messages box-friend-messages clearfix">
//       <div class="friend-name">${name}</div>
//       <div class="friend-avatar">
//         <img class="avatar" src="${getUrlAvatar(fbid)}" />
//       </div>
//       <div class="friend-messages">
//         ${message}
//       </div>
//     </div>
//   `;
// }

let appendDataForMe = (message, myMessage, myWrapMess, lastMess) => {
    if (lastMess.hasClass('box-my-messages')) {
        lastMess.children().append(myMessage);
        $("#chatchit").text(message);
        $("#chatchit").removeAttr('id');
    } else {
        $("#box-message").append(myWrapMess);
        $("#chatchit").text(message);
        $("#chatchit").removeAttr('id');
    }
};

let appendDataForFriend = (username, message, friendMessage, friendWrapMess, lastMess) => {
    if (lastMess.attr('sender') === username) {
        lastMess.children('.friend-messages').append(friendMessage);
        $("#chatchit").text(message);
        $("#chatchit").removeAttr('id');
    } else {
        $("#box-message").append(friendWrapMess);
        $("#chatchit").text(message);
        $("#chatchit").removeAttr('id');
    }
};

let someOneSendMessage = (message) => {
    let lastMess = $('.wrapper-messages:last-child');
    let messageItem = new Message(message);
    if (itsMe(messageItem.username)) {
        let myMessage = messageItem.render();
        let myWrapMessage = messageItem.wrapRender(myMessage);
        appendDataForMe(
            messageItem.message, myMessage,
            myWrapMessage, lastMess
        );
        scrollBox();
        return;
    }
    let friendMessage = messageItem.friendRender();
    let friendWrapMessage = messageItem.friendWrapRender(friendMessage);
    appendDataForFriend(
        messageItem.username, messageItem.message, friendMessage,
        friendWrapMessage, lastMess
    );
    scrollBox();
}

let someOneSendImage = (message) => {
    let lastMess = $('.wrapper-messages:last-child');
    let messageItem = new Message(message);
    if (itsMe(messageItem.username)) {
        let myImgMessage = messageItem.imgRender();
        let myWrapMessage = messageItem.wrapRender(myImgMessage);
        appendDataForMe(
            messageItem.message, myImgMessage,
            myWrapMessage, lastMess
        );
        scrollBox();
        return;
    }
    let friendImgMessage = messageItem.friendImgRender();
    let friendWrapMessage = messageItem.friendWrapRender(friendImgMessage);
    appendDataForFriend(
        messageItem.username, messageItem.message, friendImgMessage,
        friendWrapMessage, lastMess
    );
    scrollBox();
}

//fuction for video call
const fillModalCalling = (fbid, name) => {
    $('#modalCalling .avatar').attr('src', getUrlAvatar(fbid));
    $('#modalCalling .modal-body b').text(name);
};

const openPopupCenter = (url, w, h) => {
    const left = Number((screen.width / 2) - (w / 2));
    const top = Number((screen.height / 2) - (h / 2) - 50);
    return window.open(
        url, '',
        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=1, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left
    );
};
