import { ADD_INFO, SET_USER } from './actiontypes';

export function setuser(user) {
  return {
    type: SET_USER,
    payload: user,
  };
}

export function addinfo(info) {
  return {
    type: ADD_INFO,
    payload: info,
  };
}
