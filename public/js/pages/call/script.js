let hostname = `${location.protocol}//${location.host}`;
let socket = io(`${hostname}/call`); // jshint ignore:line

let myid; 
// let customConfig;

// $.ajax({
//   url: "https://service.xirsys.com/ice",
//   data: {
//     ident: "vanpho",
//     secret: "2b1c2dfe-4374-11e7-bd72-5a790223a9ce",
//     domain: "192.",
//     application: "default",
//     room: "default",
//     secure: 1
//   },
//   success: function (data, status) {
//     // data.d is where the iceServers object lives
//     customConfig = data.d;
//     console.log(customConfig);
//   },
//   async: false
// });

function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.load();
    video.addEventListener('loadeddata', function() {
      $('#localStream').css('background', 'none');
    }, false);
}

const peer = new Peer({ 
    key: 'peerjs', 
    host: 'dangdung-peer.herokuapp.com', 
    secure: true, 
    port: 443
});

peer.on('open', id => {
  myid = id;
  socket.emit('CALL_ME_TO', {...data, callerId: id});
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//Callee
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    console.log(id);
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$(document).ready(() => {
  openStream()
  .then(stream => playStream('localStream', stream));
})
