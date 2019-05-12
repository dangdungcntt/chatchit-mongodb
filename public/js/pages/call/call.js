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

$(document).ready(() => {
    socket.on('USER_CANCEL_CALL', (data) => {
        alert(data.target.name + ' đã từ chối cuộc gọi');
        window.close();
    });
    socket.on('CANNOT_CALL_NOW', (mess) => {
        alert(mess);
        window.close();
    });
})
