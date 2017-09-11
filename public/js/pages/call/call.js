peer.on('open', id => {
  myid = id;
  socket.emit('CALL_ME_TO', {...data, callerId: id});
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

$(document).ready(() => {
  socket.on('USER_CANCEL_CALL', (data) => {
    console.log(data)
    alert('User cancel call');
  });
})
