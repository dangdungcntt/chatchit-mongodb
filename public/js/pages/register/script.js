'use strict';

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

$(document).ready(() => {
    if ($('#username').val()) {
        $('#password').focus();
    } else {
        $('#username').focus();
    }

    $('form').submit(() => {
        return false;
    });

    $('#btnSubmitRegister').click(() => {

        if (!checkFormRegister()) {
            return;
        }
        $('.loading').show();
        $('#logo').attr('src', '/images/loading.gif');
        let data = {
            username: $('#username').val(),
            password: $('#password').val(),
            repassword: $('#repassword').val(),
            name: $('#name').val(),
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
                    setTimeout(() => {
                        location.href = '/login';
                    }, 100);
                } else {
                    $('.loading').hide();
                    $('#logo').attr('src', '/images/logo.png');
                    showError(res.error);
                }
            }).catch((err) => { //jshint ignore: line
            $('.loading').hide();
            $('#logo').attr('src', '/images/logo.png');
            showError('Undefined error');
        });
    });
});
