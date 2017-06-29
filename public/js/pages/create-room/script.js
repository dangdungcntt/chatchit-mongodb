'use strict';
	let showError = (err) => {
		$('#error-alert').html(err);
		$('#error-alert').slideDown(300);
		setTimeout(() => {
			$('#error-alert').slideUp(300);
		}, 3000);
		return false;
	};

	let isAlphanumeric = (text) => {
		let alphaExp = /^[0-9a-zA-Z._]+$/;
		if (alphaExp.test(text)) {
			return true;
		}
		return false;
	};

	let checkForm = () => {
		if (!isAlphanumeric($('#roomid').val())) {
			return showError('Room id can only contain a-z 0-9 . _');
		}
		if ($('#roomname').val().trim().length < 1) {
			return showError('Empty room name');
		}
		return true;
	};

	let files;

	let checkFile = (file) => {
		if (file.size > 1048576) {
			return showError('Max image size is 1MB');
		}
		if (!file.type.includes('image')) {
			return showError('Only image file');
		}
		return true;
	};

	let saveFile = (e) => {
		files = e.target.files;
		if (!checkFile(e.target.files[0])) {
			return;
		}
	};

	let upLoadFile = () => {
		if (!$('#chkMyImage').is(':checked')) {
			return $.ajax({
				url: '/api/default_room_image',
				type: 'POST',
				cache: false,
				dataType: 'json'// Set content type to false as jQuery will tell 
			});
		}
		if (!checkFile(files[0])) {
			return false;
		}
		let formData = new FormData();
		formData.append("image", files[0]);
		return $.ajax({
			url: 'https://api.imgur.com/3/image',
			type: 'POST',
			headers: {
				"Authorization": "Client-ID c495b49b842a03e"
			},
			data: formData,
			cache: false,
			dataType: 'json',
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell 
		});
	};

	let createRoom = (resUpload) => {
		let data = {
			roomid: $('#roomid').val(),
			roomname: $('<div/>').text($('#roomname').val()).html(),
			roomimage: resUpload.data.link,
			master: '<%= data.username %>'
		};
		return $.ajax({
			url: '/create-room',
			type: 'POST',
			data: data,
			dataType: 'json',
			// async: false,
			cache: false,
		});
	};

	let submitForm = (e) => {
		if (!checkForm()) {
			return false;
		}

		$('.loading').css('bottom', '0');
		$('#imgLoading').attr('src', '/images/loading.gif');
		e.preventDefault();
		upLoadFile()
			.then((resUpload) => {
				return createRoom(resUpload);
			})
			.then((resCreateRoom) => {
				if (resCreateRoom && resCreateRoom.status_code === 345) {
					$('.loading').css('bottom', '');
					$('#imgLoading').css('visibility', 'hidden');
					showError(resCreateRoom.error);
				} else if (resCreateRoom && resCreateRoom.status_code === 200) {
					let hostname = location.protocol + '//' + location.host;
					let socket = io(hostname + '/list-room'); // jshint ignore:line
					socket.emit('create-room', resCreateRoom.room);
					socket.on('created', () => {
						setTimeout(() => {
							window.location.replace('/room/' + resCreateRoom.room.roomid);
						}, 500);
					});
				} else {
					$('.loading').css('bottom', '');
					$('#imgLoading').css('visibility', 'hidden');
					showError('Undefined error');
				}
			})
			.catch((err) => {
				$('.loading').css('bottom', '');
				$('#imgLoading').css('visibility', 'hidden');
				return showError(err.responseJSON.data.error.message);
			});
		return false;
	};


	$(document).ready(() => {
		$('#roomname').focus();
		$('form').submit(submitForm);
		$('input[type=file]').on('change', saveFile);
		$('#chkMyImage').change(() => {
			if ($('#chkMyImage').prop('checked')) {
				$('#roomimage').removeAttr('disabled');
			} else {
				$('#roomimage').attr('disabled', 'disabled');
			}
		});
	});
