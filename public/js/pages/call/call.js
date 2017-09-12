peer.on('open', id => {
  myid = id;
  openStream()
  .then(stream => {
    socket.emit('CALL_ME_TO', {...data, callerId: id});
  });
});

//Callee
peer.on('call', call => {
  openStream()
  .then(stream => {
    playStream('localStream', stream);
    call.answer(stream);
    call.on('stream', remoteStream => {
      $('.target').hide();
      playStream('remoteStream', remoteStream)
    });
  });
});

$(document).ready(() => {
  socket.on('USER_CANCEL_CALL', (data) => {
    alert(data.target.name + ' đã từ chối cuộc gọi');
    window.close();
  });
})
