peer.on('open', id => {
  myid = id;
  console.log('My id: ' + id);
  openStream()
  .then(stream => {
    socket.emit('ADD_ME_TO_LIST_IN_CALL', data);
    const call = peer.call(data.callerId, stream);
    playStream('localStream', stream);
    call.on('stream', remoteStream => {
      $('.target').hide();
      playStream('remoteStream', remoteStream)
    });
    call.on('close', () => {
      disconnectToTarget();
    });
  });
});

peer.on('call', call => {
  openStream()
  .then(stream => {
    playStream('localStream', stream);
    call.answer(stream);
    call.on('stream', remoteStream => {
      clearTimeout(timeoutClose);
      clearInterval(intervalClose);
      let path = document.location.pathname.split('/');
      if (path.length < 5) {
        updateUrl(document.location + '/' + call.peer);
      } else {
        path.splice(4);
        updateUrl(path.join('/') + '/' + call.peer);
      }
      $('.target').hide();
      playStream('remoteStream', remoteStream);
    });
    call.on('close', () => {
      disconnectToTarget();
    });
  });
});
