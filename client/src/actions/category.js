import {
  CATEGORY_ACTIVE_CHANGE,
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
  CATEGORY_GET,
  CATEGORY_GET_SUCCESS,
  CATEGORY_GET_FAILURE,
} from './ActionTypes';

import axios from 'axios';

export function changeActiveCategory(category){
  return (dispatch) => {
    dispatch({type: CATEGORY_ACTIVE_CHANGE, category});
  };
}

export function addCategory(category){
  return (dispatch) => {
    dispatch({type: CATEGORY_ADD});
    return axios.post('/api/category/add',category)
    .then((res)=> {
      dispatch({type: CATEGORY_ADD_SUCCESS, category: res.data.category});
    }).catch((err)=>{
      dispatch({type: CATEGORY_ADD_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function listCategory(){
  return (dispatch) => {
    dispatch({type: CATEGORY_LIST});
    return axios.get('/api/category/list')
    .then((res)=> {
      dispatch({type: CATEGORY_LIST_SUCCESS, categories: res.data.categories});
    }).catch((err)=>{
      dispatch({type: CATEGORY_LIST_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function updateCategory(categoryID, update){
  return (dispatch) => {
    dispatch({type: CATEGORY_UPDATE});
    return axios.put('/api/category/update',{categoryID, update})
    .then((res)=> {
      dispatch({type: CATEGORY_UPDATE_SUCCESS, category: res.data.category});
    }).catch((err)=>{
      dispatch({type: CATEGORY_UPDATE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function deleteCategory(categoryID, categoryName){
  return (dispatch) => {
    dispatch({type: CATEGORY_DELETE});
    return axios.delete(`/api/category/delete/${categoryID}/${categoryName}`)
    .then((res)=> {
      dispatch({type: CATEGORY_DELETE_SUCCESS, categoryID: res.data.categoryID});
    }).catch((err)=>{
      dispatch({type: CATEGORY_DELETE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function getCategory(categoryName){
  return (dispatch) => {
    dispatch({type: CATEGORY_GET});
    return axios.get(`/api/category/get/${categoryName}`)
    .then((res)=> {
      dispatch({type: CATEGORY_GET_SUCCESS, category: res.data.category});
    }).catch((err)=>{
      dispatch({type: CATEGORY_GET_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}
