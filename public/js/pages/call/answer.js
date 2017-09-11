peer.on('open', id => {
  myid = id;
  openStream()
  .then(stream => {
      playStream('localStream', stream);
      const call = peer.call(data.callerId, stream);
      call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
  });
});
