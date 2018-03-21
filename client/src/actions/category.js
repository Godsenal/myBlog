import {
  CATEGORY_ADD,
  CATEGORY_ADD_SUCCESS,
  CATEGORY_ADD_FAILURE,
  CATEGORY_LIST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAILURE,
  CATEGORY_UPDATE,
  CATEGORY_UPDATE_SUCCESS,
  CATEGORY_UPDATE_FAILURE,
  CATEGORY_DELETE,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_FAILURE,
} from './ActionTypes';

import axios from 'axios';

export function addCategory(category){
  return (dispatch) => {
    dispatch({type: CATEGORY_ADD});
    return axios.post('api/category/add',category)
    .then((res)=> {
      dispatch({type: CATEGORY_ADD_SUCCESS, category: res.data.category});
    }).catch((err)=>{
      dispatch({type: CATEGORY_ADD_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function listCategory(category){
  return (dispatch) => {
    dispatch({type: CATEGORY_LIST});
    return axios.get('api/category/list')
    .then((res)=> {
      dispatch({type: CATEGORY_LIST_SUCCESS, categories: res.data.categories});
    }).catch((err)=>{
      dispatch({type: CATEGORY_LIST_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function updateCategory(category){
  return (dispatch) => {
    dispatch({type: CATEGORY_UPDATE});
    return axios.post('api/category/update',category)
    .then((res)=> {
      dispatch({type: CATEGORY_UPDATE_SUCCESS, category: res.data.category});
    }).catch((err)=>{
      dispatch({type: CATEGORY_UPDATE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function deleteCategory(categoryID){
  return (dispatch) => {
    dispatch({type: CATEGORY_DELETE});
    return axios.post('api/category/delete',{id: categoryID})
    .then((res)=> {
      dispatch({type: CATEGORY_DELETE_SUCCESS, category: res.data.category});
    }).catch((err)=>{
      dispatch({type: CATEGORY_DELETE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}
