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
  related:{
    tags:{
      status: 'INIT',
      posts: [],
      err: 'ERROR',
      errCode: -1,
    },
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
    count: 0,
    err: 'ERROR',
    errCode: -1,
  },
  rate:{
    status: 'INIT',
    err: 'ERROR',
    errCode: -1,
  },
  search:{
    status: 'INIT',
    results: [],
    err: 'ERROR',
    errCode: -1,
  },
  searchCount:{
    status: 'INIT',
    count: 0,
    err: 'ERROR',
    errCode: -1,
  },
  history:{
    isBack: false,
    number: 1,
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
  /* GET RELATED TAGS POST */
  case types.POST_RELATED_TAGS_GET:
    return update(state, {
      related: {
        tags:{
          status: {$set: 'WAITING'}
        }
      }
    });
  case types.POST_RELATED_TAGS_GET_SUCCESS:
    return update(state, {
      related: {
        tags:{
          posts: {$set: action.posts},
          status: {$set: 'SUCCESS'}
        }
      }
    });
  case types.POST_RELATED_TAGS_GET_FAILURE:
    return update(state, {
      related: {
        tags:{
          status: {$set: 'FAILURE'},
          err: {$set: action.err},
          errCode: {$set: action.errCode}
        }
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
        status: {$set: 'SUCCESS'},
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

  /* SEARCH POST */
  case types.POST_SEARCH:
    return update(state, {
      search: {
        status: {$set: 'WAITING'}
      }
    });
  case types.POST_SEARCH_SUCCESS:
    return update(state, {
      search:{
        results:{$set: action.results},
        status:{$set: 'SUCCESS'}
      },
    });
  case types.POST_SEARCH_FAILURE:
    return update(state, {
      search: {
        status: {$set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode}
      }
    });

  /* SEARCH POST COUNT*/
  case types.POST_SEARCH_COUNT:
    return update(state, {
      searchCount: {
        status: {$set: 'WAITING'}
      }
    });
  case types.POST_SEARCH_COUNT_SUCCESS:
    return update(state, {
      searchCount:{
        count:{$set: action.count},
        status:{$set: 'SUCCESS'}
      },
    });
  case types.POST_SEARCH_COUNT_FAILURE:
    return update(state, {
      searchCount: {
        status: {$set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode}
      }
    });
    /* DATE POST*/
  case types.POST_DATE:
    return update(state, {
      list: {
        status: {$set: 'WAITING'}
      }
    });
  case types.POST_DATE_SUCCESS:
    return update(state, {
      list:{
        posts:{$set: action.posts},
        status:{$set: 'SUCCESS'}
      },
    });
  case types.POST_DATE_FAILURE:
    return update(state, {
      list: {
        posts: {$set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode}
      }
    });
    /* DATE POST COUNT*/
  case types.POST_DATE_COUNT:
    return update(state, {
      count: {
        status: {$set: 'WAITING'}
      }
    });
  case types.POST_DATE_COUNT_SUCCESS:
    return update(state, {
      count:{
        count:{$set: action.count},
        status:{$set: 'SUCCESS'}
      },
    });
  case types.POST_DATE_COUNT_FAILURE:
    return update(state, {
      count: {
        status: {$set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode}
      }
    });
  default:
    return state;
  }
}
