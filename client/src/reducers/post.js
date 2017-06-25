import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  add: {
    status: 'INIT',
    post: {},
    err: 'ERROR',
    errCode: -1,
  },
  list: {
    status: 'INIT',
    category: '',
    posts: [],
    err: 'ERROR',
    errCode: -1,
  },
  update: {
    status: 'INIT',
    post: {},
    err: 'ERROR',
    errCode: -1,
  },
  delete: {
    status: 'INIT',
    post: {},
    err: 'ERROR',
    errCode: -1,
  }
}

export default function post(state, action){
  if(typeof state === 'undefined'){
    state = initialState;
  }

  switch (action.type) {

    /* ADD POST */
    case types.POST_ADD:
      return update(state, {
        add: {
          status: {$set: 'WAITING'}
        }
      });
    case types.POST_ADD_SUCCESS:
      return update(state, {
        add: {
          status: {$set: 'SUCCESS'}
        },
        list:{
          posts: {$unshift: action.post}
        }
      });
    case types.POST_ADD_FAILURE:
      return update(state, {
        add: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });

    /* LIST POST */
    case types.POST_LIST:
      return update(state, {
        list: {
          status: {$set: 'WAITING'}
        }
      });
    case types.POST_LIST_SUCCESS:
      return update(state, {
        list:{
          category: {$set: action.category},
          posts: {$set: action.posts}
        }
      });
    case types.POST_LIST_FAILURE:
      return update(state, {
        list: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });

    /* UPDATE POST */
    case types.POST_UPDATE:
      return update(state, {
        update: {
          status: {$set: 'WAITING'}
        }
      });
    case types.POST_UPDATE_SUCCESS:
      for(var i=0; i<state.list.posts.length; i++){
        // UPDATE 시 list에 있는 것도 업데이트.
        if(state.list.posts[i].id == action.post.id){
          state = update(state, {
            list:{
              posts:{
                [i]: {$set: action.post}
              },
            },
          });

          break;
        }
      }
      return update(state, {
        update:{
          post: {$set: action.post}
        }
      });
    case types.POST_UPDATE_FAILURE:
      return update(state, {
        update: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });

    /* DELETE POST */
    case types.POST_DELETE:
      return update(state, {
        delete: {
          status: {$set: 'WAITING'}
        }
      });
    case types.POST_DELETE_SUCCESS:
      return update(state, {
        delete:{
          post: {$set: action.post}
        }
      });
    case types.POST_DELETE_FAILURE:
      return update(state, {
        delete: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });
    default:
      return state;
  }
}
