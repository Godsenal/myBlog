import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  signin: {
    status: 'INIT',
    err: 'ERROR',
    errCode: -1,
  },
  status: {
    err: 'ERROR',
    errCode: -1,
    valid: false,
    isSignedIn: false,
    username: '',
    token : '',
  },
};


export default function authentication(state, action) {
  if(typeof state === 'undefined') {
    state = initialState;
  }

  switch(action.type) {
        /* LOGIN */
  case types.AUTH_SIGNIN:
    return update(state, {
      signin: {
        status: { $set: 'WAITING '}
      }
    });
  case types.AUTH_SIGNIN_SUCCESS:
    return update(state, {
      signin: {
        status: { $set: 'SUCCESS' }
      },
      status: {
        isSignedIn: { $set: true },
        username: { $set: action.username },
        token: { $set: action.token},
        valid: { $set:true},
      }
    });
  case types.AUTH_SIGNIN_FAILURE:
    return update(state, {
      signin: {
        isSignedIn: { $set: false },
        username: { $set: '' },
        token: { $set: ''},
        status: { $set: 'FAILURE' },
        valid: { $set:false},
        err: { $set: action.err},
        errCode: { $set: action.code}
      }
    });

        /* getinfo */
  case types.AUTH_GET_STATUS:
    return update(state, {
      status: {
        isSignedIn: { $set: true }
      }
    });
  case types.AUTH_GET_STATUS_SUCCESS:
    return update(state, {
      status: {
        valid: { $set: true },
        username: { $set: action.username },
        token: { $set: action.token },
      }
    });
  case types.AUTH_GET_STATUS_FAILURE:
    return update(state, {
      status: {
        valid: { $set: false },
        isSignedIn: { $set: false },
        err: { $set: action.err},
        errCode: { $set: action.code}
      }
    });

        /* logout */
  case types.AUTH_SIGNOUT:
    return update(state, {
      status: {
        valid: { $set: false},
        isSignedIn: { $set: false },
        username: { $set: '' },
      }
    });
  default:
    return state;
  }
}
