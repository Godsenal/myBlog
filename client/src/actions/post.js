import {
  POST_ADD,
  POST_ADD_SUCCESS,
  POST_ADD_FAILURE,
  POST_GET,
  POST_GET_SUCCESS,
  POST_GET_FAILURE,
  POST_PREV_GET,
  POST_PREV_GET_SUCCESS,
  POST_PREV_GET_FAILURE,
  POST_NEXT_GET,
  POST_NEXT_GET_SUCCESS,
  POST_NEXT_GET_FAILURE,
  POST_LIST,
  POST_LIST_SUCCESS,
  POST_LIST_FAILURE,
  POST_UPDATE,
  POST_UPDATE_SUCCESS,
  POST_UPDATE_FAILURE,
  POST_DELETE,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAILURE,
  POST_COUNT,
  POST_COUNT_SUCCESS,
  POST_COUNT_FAILURE,
  POST_RATE,
  POST_RATE_SUCCESS,
  POST_RATE_FAILURE,
  POST_SEARCH,
  POST_SEARCH_SUCCESS,
  POST_SEARCH_FAILURE,
} from './ActionTypes';

import axios from 'axios';

export function addPost(post){
  return (dispatch) => {
    dispatch({type: POST_ADD});
    return axios.post('/api/post/add',post)
    .then((res)=> {
      dispatch({type: POST_ADD_SUCCESS, post: res.data.post});
    }).catch((err)=>{
      dispatch({type: POST_ADD_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function getPost(postID){
  return (dispatch) => {
    dispatch({type: POST_GET});
    var url = `/api/post/get/${postID}`;
    return axios.get(url)
      .then((res)=>{
        dispatch({type: POST_GET_SUCCESS, post: res.data.post});
      }).catch((err)=>{
        dispatch({type: POST_GET_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
      });
  };
}

export function getPrevPost(postID, categoryName){
  return (dispatch) => {
    dispatch({type: POST_PREV_GET});
    var url = `/api/post/get/prev/${postID}/${categoryName}`;
    return axios.get(url)
      .then((res)=>{
        dispatch({type: POST_PREV_GET_SUCCESS, post: res.data.post});
      }).catch((err)=>{
        dispatch({type: POST_PREV_GET_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
      });
  };
}

export function getNextPost(postID, categoryName){
  return (dispatch) => {
    dispatch({type: POST_NEXT_GET});
    var url = `/api/post/get/next/${postID}/${categoryName}`;
    return axios.get(url)
      .then((res)=>{
        dispatch({type: POST_NEXT_GET_SUCCESS, post: res.data.post});
      }).catch((err)=>{
        dispatch({type: POST_NEXT_GET_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
      });
  };
}

export function listPost(category, number){
  return (dispatch) => {
    dispatch({type: POST_LIST});
    var url = `/api/post/list/${category}`;
    if(!category){
      url = '/api/post/list/all';
    }
    if(number){
      url += `/${number}`;
    }

    return axios.get(url)
    .then((res)=> {
      dispatch({type: POST_LIST_SUCCESS, posts: res.data.posts});
    }).catch((err)=>{
      dispatch({type: POST_LIST_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function updatePost(post){
  return (dispatch) => {
    dispatch({type: POST_UPDATE});
    return axios.post('/api/post/update',post)
    .then((res)=> {
      dispatch({type: POST_UPDATE_SUCCESS, post: res.data.post});
    }).catch((err)=>{
      dispatch({type: POST_UPDATE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function deletePost(postID){
  return (dispatch) => {
    dispatch({type: POST_DELETE});
    return axios.post('/api/post/delete',{id: postID})
    .then((res)=> {
      dispatch({type: POST_DELETE_SUCCESS, post: res.data.post});
    }).catch((err)=>{
      dispatch({type: POST_DELETE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function countPost(category){
  return (dispatch) => {
    dispatch({type: POST_COUNT});
    var url = `/api/post/count/${category}`;
    if(!category){
      url = '/api/post/count/all';
    }
    return axios.get(url)
      .then((res)=>{
        dispatch({type: POST_COUNT_SUCCESS, count: res.data.count});
      }).catch((err)=>{
        dispatch({type: POST_COUNT_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
      });
  };
}

export function ratePost(postID){
  return (dispatch) => {
    dispatch({type: POST_RATE});
    return axios.post('/api/post/increase/rating',{id: postID})
      .then((res)=>{
        dispatch({type: POST_RATE_SUCCESS, rating: res.data.rating});
      }).catch((err)=>{
        dispatch({type: POST_RATE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
      });
  };
}

export function searchPost(type, category, word){
  return (dispatch) => {
    dispatch({type: POST_SEARCH});
    let search = {
      type, category, word,
    };
    return axios.post('/api/post/search',search)
      .then((res)=>{
        dispatch({type: POST_SEARCH_SUCCESS, result: res.data.result});
      }).catch((err)=>{
        dispatch({type: POST_SEARCH_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
      });
  };
}
