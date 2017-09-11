let hostname = `${location.protocol}//${location.host}`;
let socket = io(`${hostname}/call`); // jshint ignore:line

let myid; 
let customConfig;

// Call Xirsys ICE servers
// $.ajax ({
//   url: "https://global.xirsys.net/_turn/ChatChit/",
//   type: "PUT",
//   async: false,
//   headers: {
//     "Authorization": "Basic " + btoa("dangdungcntt:2655cd46-96a5-11e7-8791-9354bcb0cf6a")
//   },
//   success: function (res){
//     console.log("ICE List: "+res.v.iceServers);
//     customConfig = res.v.iceServers;
//     console.log(customConfig);
//   }
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
    port: 443, 
    // config: customConfig 
});
