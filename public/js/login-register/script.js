'use strict';

	let checkExistsToken = () => {
		if (typeof(Storage) !== "undefined") {
			let token = localStorage.getItem('token');
			if (token) {
				return token;
			}
		}
		return false;
	};

	let isAlphanumeric = (text) => {
		let alphaExp = /^[0-9a-zA-Z._]+$/;
		if (alphaExp.test(text)) {
			return true;
		}
		return false;
	};
	
	let showError = (err) => {
		$('#error-alert').html(err);
		$('#error-alert').slideDown(300);
		setTimeout(() => {
			$('#error-alert').slideUp(300);
		}, 3000);
		return false;
	};

	let showSuccess = (msg) => {
		$('#success-alert').html(msg);
		$('#success-alert').slideDown(300);
		setTimeout(() => {
			$('#success-alert').slideUp(300);
		}, 3000);
	};

	let checkFormRegister = () => {
		if (!isAlphanumeric($('#username').val())) {
			return showError('Username can only contain a-z 0-9 . _');
		}
		if ($('#username').val().length < 6) {
			return showError('Username must be at least 6 characters');
		}

		if ($('#password').val().length < 6) {
			return showError('Password must be at least 6 characters');
		}
		if ($('#password').val() !== $('#repassword').val()) {
			return showError('Re-Password does not match');
		}
		return true;
	};

	let checkFormLogin = () => {
		if ($('#username').val().length < 6) {
			return showError('Username must be at least 6 characters');
		}

		if (!isAlphanumeric($('#username').val())) {
			return showError('Username can only contain a-z 0-9 . _');
		}
		
		if ($('#password').val().length < 6) {
			return showError('Password must be at least 6 characters');
		}
		return true;
	};

	$(document).ready(() => {
		if ($('#username').val()) {
			$('#password').focus();
		}
		
		$('form' ).submit(() => {
			return false;
		});

		$('#btnLogin').click(() => {

			if (!checkFormLogin()) {
				return;
			}

			let data = {
				username: $('#username').val(),
				password: $('#password').val(),
				_shortidLogin: $('#_shortidLogin').attr('value')
			};
			$.ajax({
				url: '/authenticate',
				type: 'POST',
				data: data,
				dataType: 'json'
			})
			.then((res) => {
				if (res && res.status_code === 200) {
					if (typeof(Storage) !== "undefined") {
					    // Code for localStorage/sessionStorage.
					    localStorage.setItem('token', res.token);
					    localStorage.setItem('refreshToken', res.refreshToken);
					}
					showSuccess('Success');
					setTimeout(() => {
						location.href = '/';
					}, 2000);
				} else {
					showError(res.error);
				}
			})
			.catch((err) => { //jshint ignore: line
				showError('Undefined error');
			});
		});

		$('#btnSubmitRegister').click(() => {

			if (!checkFormRegister()) {
				return;
			}
			let data = {
				username: $('#username').val(),
				password: $('#password').val(),
				repassword: $('#repassword').val(),
				email: $('#email').val(),
				_shortidRegister: $('#_shortidRegister').attr('value')
			};
			$.ajax({
				url: '/register',
				type: 'POST',
				data: data,
				dataType: 'json'
			})
			.then((res) => {
				if (res && res.status_code === 200) {
					showSuccess('Success');
					setTimeout(() => {
						location.href = '/login';
					}, 1500);
				} else {
					showError(res.error);
				}
			}).catch((err) => { //jshint ignore: line
				showError('Undefined error');
			});
		});
	});

	let token = checkExistsToken();
	if (token) {
		let data = {
			token: token
		};
		$.ajax({
			url: '/checkToken',
			type: 'POST',
			data: data,
			dataType: 'json',

		})
		.then((res) => {
			if (res && res.status_code === 200) {
				localStorage.setItem('token', res.token);
				localStorage.setItem('refreshToken', res.refreshToken);
				location.href = '/';
			} else if (res && res.status_code === 410){
				let refresh = {
					refreshToken: localStorage.getItem('refreshToken')
				};
				return $.ajax({
					url: '/refreshToken',
					type: 'POST',
					data: refresh,
					dataType: 'json',
				});
			}
		})
		.then((res) => {
			if (res && res.status_code === 200) {
				localStorage.setItem('token', res.token);
				localStorage.setItem('refreshToken', res.refreshToken);
				location.href = '/';
			}
		})
		.catch((err) => { //jshint ignore: line

		});
	}