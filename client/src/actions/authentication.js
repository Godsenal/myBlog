import {
    AUTH_SIGNIN,
    AUTH_SIGNIN_SUCCESS,
    AUTH_SIGNIN_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_SIGNOUT,
} from './ActionTypes';

import axios from 'axios';

/* dispatch안에는 action 객체가 들어가고 state 는 redux에서 알아서 관리
   err말고 error을 쓰는 이유는, 기본 err과 겹치는 것을  피하기 위해 */

export function signinRequest(email, password) {
  return (dispatch) => {
    dispatch({type: AUTH_SIGNIN});
    return axios.post('/api/account/signin', { email, password })
            .then((res) => {
              localStorage.setItem('token', res.data.token);
              dispatch({type: AUTH_SIGNIN_SUCCESS, email, username: res.data.username, token:res.data.token });
            }).catch((err) => {
              localStorage.removeItem('token');
              dispatch({type: AUTH_SIGNIN_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
}
/* GET STATUS */

export function getStatusRequest(token) {
  const AuthStr = 'Bearer '.concat(token);
  return (dispatch) => {
    dispatch({type: AUTH_GET_STATUS});
    return axios.get('/api/account/getinfo',{ headers: { 'Authorization': AuthStr } })
            .then((res) => {
              localStorage.setItem('token', token);
              dispatch({type: AUTH_GET_STATUS_SUCCESS, username: res.data.info.id, token});
            }).catch((err) => {
              localStorage.removeItem('token');
              dispatch({type: AUTH_GET_STATUS_FAILURE, err: err.response.data.error});
            });
  };
}

/* LOGOUT */
export function signoutRequest() {
  return (dispatch) => {
    localStorage.removeItem('token');
    var url = window.location.origin;
    window.location.replace(url);
    dispatch({type: AUTH_SIGNOUT});
  };
}
