'use strict';
let listInCall = [];

let checkUserInCall = (username) => {
  return listInCall.indexOf(username) > -1;
};

let pushUser = (username) => {
  listInCall.push(username);
};

let removeUser = (username) => {
  let index = listInCall.indexOf(username);
  if (index === -1) {
    return false;
  }
  listInCall.splice(index, 1);
  return true;
};

module.exports = {
  checkUserInCall,
  pushUser,
  removeUser
};
