import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  add: {
    status: 'INIT',
    post: {},
    err: 'ERROR',
    errCode: -1,
  },
  get: {
    status: 'INIT',
    post: {},
    err: 'ERROR',
    errCode: -1,
  },
  prev: {
    status: 'INIT',
    post: {},
    err: 'ERROR',
    errCode: -1,
  },
  next: {
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
  },
  count: {
    status: 'INIT',
    count: 100,
    err: 'ERROR',
    errCode: -1,
  },
  rate:{
    status: 'INIT',
    err: 'ERROR',
    errCode: -1,
  }
};

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
          posts: {$unshift: [action.post]}
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

    /* GET POST */
    case types.POST_GET:
      return update(state, {
        get: {
          status: {$set: 'WAITING'}
        }
      });
    case types.POST_GET_SUCCESS:
      return update(state, {
        get: {
          post: {$set: action.post},
          status: {$set: 'SUCCESS'}
        }
      });
    case types.POST_GET_FAILURE:
      return update(state, {
        get: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });

    /* GET PREV POST */
    case types.POST_PREV_GET:
      return update(state, {
        prev: {
          status: {$set: 'WAITING'}
        }
      });
    case types.POST_PREV_GET_SUCCESS:
      return update(state, {
        prev: {
          post: {$set: action.post},
          status: {$set: 'SUCCESS'}
        }
      });
    case types.POST_PREV_GET_FAILURE:
      return update(state, {
        prev: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });

    /* GET NEXT POST */
    case types.POST_NEXT_GET:
      return update(state, {
        next: {
          status: {$set: 'WAITING'}
        }
      });
    case types.POST_NEXT_GET_SUCCESS:
      return update(state, {
        next: {
          post: {$set: action.post},
          status: {$set: 'SUCCESS'}
        }
      });
    case types.POST_NEXT_GET_FAILURE:
      return update(state, {
        next: {
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
          status: {$set: 'SUCCESS'},
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
          status: {$set: 'SUCCESS'},
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
          status: {$set: 'SUCCESS'},
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
    /* COUNT POST */
    case types.POST_COUNT:
      return update(state, {
        count: {
          status: {$set: 'WAITING'}
        }
      });
    case types.POST_COUNT_SUCCESS:
      return update(state, {
        count:{
          count: {$set: action.count}
        }
      });
    case types.POST_COUNT_FAILURE:
      return update(state, {
        count: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });
    /* RATE POST */
    case types.POST_RATE:
      return update(state, {
        rate: {
          status: {$set: 'WAITING'}
        }
      });
    case types.POST_RATE_SUCCESS:
      return update(state, {
        rate:{
          status:{$set: 'SUCCESS'}
        },
        get:{
          post: {
            rate: {$set: action.rating}
          }
        }
      });
    case types.POST_RATE_FAILURE:
      return update(state, {
        rate: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });
    default:
      return state;
  }
}
