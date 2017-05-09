'use strict';
function isOnSideBar(target) {
	var arrId = [
	'number-user-online',
	'btn-open-sidebar',
	'left'
	];
	var arrClassName = [
	'list-user-online',
	'btn-open-sidebar',
	'left'
	];
	if (arrId.indexOf(target.id) > -1) {
		return true;
	}
	if (arrClassName.indexOf(target.className) > -1) {
		return true;
	}
	if (target.className.includes('item-user-online')) {
		return true;
	}
	return false;

}

$(document).ready(() => {
	$('#btn-open-sidebar').click(() => {
		if ($(window).width() < 768) {
			$('#left').slideToggle(200);
		}
	});
	$(document).click((e) => {
		// console.log(e.target.className);
	    if ($(window).width() < 768 && $('#left').css('display') === 'block' && ! isOnSideBar(e.target)) {
	    	// $('#left').hide();
	    	$('#left').slideUp(200);
	    }
	});
	$('#btn-turn-on-webcam').click(() => {
		alert('Coming soon!');
	});
});