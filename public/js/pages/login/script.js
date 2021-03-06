'use strict';
let checkExistsToken = () => {
    if ($('#btnSubmitRegister').length) {
        return false;
    }
    if (typeof Storage !== 'undefined') {
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
    } else {
        $('#username').focus();
    }
    $('form').submit(() => {
        return false;
    });

    $('#btnLogin').click(() => {
        if (!checkFormLogin()) {
            return;
        }
        $('.loading').show();
        $('#logo').attr('src', '/images/loading.gif');
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
                    if (typeof Storage !== 'undefined') {
                        localStorage.setItem('token', res.token);
                        localStorage.setItem('refreshToken', res.refreshToken);
                    }
                    setTimeout(() => {
                        location.href = '/redirect/current';
                    }, 1000);
                } else {
                    $('.loading').hide();
                    $('#logo').attr('src', '/images/logo.png');
                    showError(res.error);
                }
            })
            .catch((err) => { //jshint ignore: line
                showError('Undefined error');
                $('.loading').hide();
                $('#logo').attr('src', '/images/logo.png');
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
                setTimeout(() => {
                    location.href = '/redirect/current';
                }, 1000);
            } else if (res && res.status_code === 410) {
                let refresh = {
                    refreshToken: localStorage.getItem('refreshToken')
                };
                return $.ajax({
                    url: '/refreshToken',
                    type: 'POST',
                    data: refresh,
                    dataType: 'json',
                });
            } else {
                $('.loading').css('background', '');
                $('.loading').fadeOut(200);
            }

        })
        .then((res) => {
            if (res && res.status_code === 200) {
                localStorage.setItem('token', res.token);
                localStorage.setItem('refreshToken', res.refreshToken);
                setTimeout(() => {
                    location.href = '/';
                }, 1000);
            } else {
                if (typeof res !== 'undefined') {
                    $('.loading').css('background', '');
                    $('.loading').fadeOut(200);
                }
            }
        })
        .catch((err) => { //jshint ignore: line
            $('.loading').css('background', '');
            $('.loading').fadeOut(200);
        });
} else {
    $('.loading').css('background', '');
    $('.loading').fadeOut(200);
}
