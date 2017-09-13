let hostname = `${location.protocol}//${location.host}`;
let socket = io(`${hostname}/call`); // jshint ignore:line

let myid, customConfig, timeoutClose, intervalClose;

const updateUrl = (url) => {
  history.pushState(null, null, url);
};

let getUrlAvatar = (fbid, w = 40, h = 40) => {
  if (fbid !== '') {
    return `https://graph.facebook.com/${fbid}/picture?type=large&redirect=true&width=${w}&height=${h}`;
  } else {
    return '/images/default_avatar.jpg';
  }
};
const fillTargetInfo = (fbid, name) => {
  $('.target-info #avatar').attr('src', getUrlAvatar(fbid, 150, 150));
  $('.target-info #name').text(name);
};
const fillTargetStatus = (status) => {
  $('.target').show();
  $('.target-info #status').text(status);
};
const updateEndTime = (seconds) => {
  $('.target-info #end-time').show();
  $('.target-info #end-time #time').text(seconds);
};
const disconnectToTarget = () => {
  fillTargetStatus('Mất kết nối, đang chờ kết nối lại');
  let seconds = 15;
  updateEndTime(seconds);
  intervalClose = setInterval(() => {
    updateEndTime(--seconds);
  }, 1000);
  timeoutClose = setTimeout(() => {
    clearInterval(intervalClose);
    alert('Cuộc gọi đã kết thúc');
    window.close();
  }, 15000);
}
fillTargetInfo(data.target.fbid, data.target.name);

// // Call Xirsys ICE servers
$.ajax ({
  url: "https://global.xirsys.net/_turn/ChatChit/",
  type: "PUT",
  async: false,
  headers: {
    "Authorization": "Basic " + btoa("dangdungcntt:2655cd46-96a5-11e7-8791-9354bcb0cf6a")
  },
  success: function (res){
    console.log("ICE List: "+res.v.iceServers);
    customConfig = res.v;
    console.log(customConfig);
  }
});


function openStream() {
    const config = {
      audio: false,
      video: { 
        facingMode: "user"
      }
    };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
    video.addEventListener('loadeddata', function() {
      $('#localStream').css('background', 'none');
    }, false);
}

const peer = new Peer({ 
    key: 'peerjs', 
    host: 'dangdung-peer.herokuapp.com', 
    secure: true, 
    port: 443, 
    config: customConfig
});
