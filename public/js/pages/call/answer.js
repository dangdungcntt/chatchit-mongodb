peer.on('open', id => {
  myid = id;
  openStream()
  .then(stream => {
    const call = peer.call(data.callerId, stream);
    playStream('localStream', stream);
    call.on('stream', remoteStream => {
      $('.target').hide();
      playStream('remoteStream', remoteStream)
    });
  });
});
