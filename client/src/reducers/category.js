import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  activeCategory: {

  },
  add: {
    status: 'INIT',
    category: {},
    err: 'ERROR',
    errCode: -1,
  },
  list: {
    status: 'INIT',
    categories: [],
    err: 'ERROR',
    errCode: -1,
  },
  update: {
    status: 'INIT',
    category: {},
    err: 'ERROR',
    errCode: -1,
  },
  delete: {
    status: 'INIT',
    category: {},
    err: 'ERROR',
    errCode: -1,
  },
  get:{
    status: 'INIT',
    category: {},
    err: 'ERROR',
    errCode: -1,
  }
};

export default function category(state, action){
  if(typeof state === 'undefined'){
    state = initialState;
  }

  switch (action.type) {

  /* SWITCH ACTIVE(CURRENT) CATEGORY */
  case types.CATEGORY_ACTIVE_CHANGE:
    return update(state,{
      activeCategory: {$set: action.category}
    });
  /* ADD CATEGORY */
  case types.CATEGORY_ADD:
    return update(state, {
      add: {
        status: {$set: 'WAITING'}
      }
    });
  case types.CATEGORY_ADD_SUCCESS:
    return update(state, {
      add: {
        status: {$set: 'SUCCESS'}
      },
      list:{
        categories: {$push: [action.category]}
      }
    });
  case types.CATEGORY_ADD_FAILURE:
    return update(state, {
      add: {
        status: {$set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode}
      }
    });

  /* LIST CATEGORY */
  case types.CATEGORY_LIST:
    return update(state, {
      list: {
        status: {$set: 'WAITING'}
      }
    });
  case types.CATEGORY_LIST_SUCCESS:
    return update(state, {
      list:{
        status: {$set: 'SUCCESS'},
        categories: {$set: action.categories}
      }
    });
  case types.CATEGORY_LIST_FAILURE:
    return update(state, {
      list: {
        status: {$set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode}
      }
    });

  /* UPDATE CATEGORY */
  case types.CATEGORY_UPDATE:
    return update(state, {
      update: {
        status: {$set: 'WAITING'}
      }
    });
  case types.CATEGORY_UPDATE_SUCCESS:
    for(var i=0; i<state.list.categories.length; i++){
      // UPDATE 시 list에 있는 것도 업데이트.
      if(state.list.categories[i]._id == action.category._id){
        state = update(state, {
          list:{
            categories:{
              [i]: {$set: action.category}
            },
          },
        });

        break;
      }
    }
    return update(state, {
      update:{
        category: {$set: action.category},
        status: {$set: 'SUCCESS'},
      }
    });
  case types.CATEGORY_UPDATE_FAILURE:
    return update(state, {
      update: {
        status: {$set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode}
      }
    });

  /* DELETE CATEGORY */
  case types.CATEGORY_DELETE:
    return update(state, {
      delete: {
        status: {$set: 'WAITING'}
      }
    });
  case types.CATEGORY_DELETE_SUCCESS:

    for(let i=0; i<state.list.categories.length; i++){
      // UPDATE 시 list에 있는 것도 업데이트.
      if(state.list.categories[i]._id == action.categoryID){
        state = update(state, {
          list:{
            categories:{ $splice: [[i,1]] },
          },
        });
        break;
      }
    }
    return update(state, {
      delete:{
        status: {$set: 'SUCCESS'},
      }
    });
  case types.CATEGORY_DELETE_FAILURE:
    return update(state, {
      delete: {
        status: {$set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode}
      }
    });

  /* GET CATEGORY */
  case types.CATEGORY_GET:
    return update(state, {
      get: {
        status: {$set: 'WAITING'}
      }
    });
  case types.CATEGORY_GET_SUCCESS:
    return update(state, {
      get:{
        status: {$set: 'SUCCESS'},
        category: {$set: action.category}
      }
    });
  case types.CATEGORY_GET_FAILURE:
    return update(state, {
      get: {
        status: {$set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode}
      }
    });
  default:
    return state;
  }
}
