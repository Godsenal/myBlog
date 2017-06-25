import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  add: {
    status: 'INIT',
    comment: {},
    err: 'ERROR',
    errCode: -1,
  },
  list: {
    status: 'INIT',
    comments: [],
    err: 'ERROR',
    errCode: -1,
  },
  update: {
    status: 'INIT',
    comment: {},
    err: 'ERROR',
    errCode: -1,
  },
  delete: {
    status: 'INIT',
    comment: {},
    err: 'ERROR',
    errCode: -1,
  }
}

export default function comment(state, action){
  if(typeof state === 'undefined'){
    state = initialState;
  }

  switch (action.type) {

    /* ADD COMMENT */
    case types.COMMENT_ADD:
      return update(state, {
        add: {
          status: {$set: 'WAITING'}
        }
      });
    case types.COMMENT_ADD_SUCCESS:
      return update(state, {
        add: {
          status: {$set: 'SUCCESS'}
        },
        list:{
          comments: {$push: action.comment}
        }
      });
    case types.COMMENT_ADD_FAILURE:
      return update(state, {
        add: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });

    /* LIST COMMENT */
    case types.COMMENT_LIST:
      return update(state, {
        list: {
          status: {$set: 'WAITING'}
        }
      });
    case types.COMMENT_LIST_SUCCESS:
      return update(state, {
        list:{
          category: {$set: action.category},
          comments: {$set: action.comments}
        }
      });
    case types.COMMENT_LIST_FAILURE:
      return update(state, {
        list: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });

    /* UPDATE COMMENT */
    case types.COMMENT_UPDATE:
      return update(state, {
        update: {
          status: {$set: 'WAITING'}
        }
      });
    case types.COMMENT_UPDATE_SUCCESS:
      for(var i=0; i<state.list.comments.length; i++){
        // UPDATE 시 list에 있는 것도 업데이트.
        if(state.list.comments[i].id == action.comment.id){
          state = update(state, {
            list:{
              comments:{
                [i]: {$set: action.comment}
              },
            },
          });

          break;
        }
      }
      return update(state, {
        update:{
          comment: {$set: action.comment}
        }
      });
    case types.COMMENT_UPDATE_FAILURE:
      return update(state, {
        update: {
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
      });

    /* DELETE COMMENT */
    case types.COMMENT_DELETE:
      return update(state, {
        delete: {
          status: {$set: 'WAITING'}
        }
      });
    case types.COMMENT_DELETE_SUCCESS:
      return update(state, {
        delete:{
          comment: {$set: action.comment}
        }
      });
    case types.COMMENT_DELETE_FAILURE:
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
