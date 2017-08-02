'use strict';
let isAlphanumeric = (text) => {
  let alphaExp = /^[0-9a-zA-Z._]+$/;
  if (alphaExp.test(text)) {
    return true;
  }
  return false;
};

let checkUsernamePassword = (user) => {
  if (!isAlphanumeric(user.username)) {
    return {
      status_code: 345,
      error: 'Username can only contain a-z 0-9 . _'
    };
  }

  if (user.username.length < 6) {
    return {
      status_code: 345,
      error: 'Username must be at least 6 characters'
    };
  }

  if (user.password.length < 6) {
    return {
      status_code: 345,
      error: 'Password must be at least 6 characters'
    };
  }

  if (user.password !== user.repassword) {
    return {
      status_code: 345,
      error: 'Re-Password does not match'
    };
  }

  return {
    status_code: 200,
  };
};

module.exports = {
  isAlphanumeric,
  checkUsernamePassword
};
