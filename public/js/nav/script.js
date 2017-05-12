'use strict';
$(document).ready(() => {
	$('#btnLogout').click(() => {
		$.ajax({
			url: '/logout',
			type: 'post'
		})
		.then(() => {
			if (typeof(Storage) !== "undefined") {
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
			}
			location.href = "/";
		});
	});
});