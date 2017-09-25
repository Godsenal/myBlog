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
  POST_RELATED_TAGS_GET,
  POST_RELATED_TAGS_GET_SUCCESS,
  POST_RELATED_TAGS_GET_FAILURE,
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
  POST_SEARCH_COUNT,
  POST_SEARCH_COUNT_SUCCESS,
  POST_SEARCH_COUNT_FAILURE,
  POST_DATE,
  POST_DATE_SUCCESS,
  POST_DATE_FAILURE,
  POST_DATE_COUNT,
  POST_DATE_COUNT_SUCCESS,
  POST_DATE_COUNT_FAILURE,
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

export function getRelatedTagsPost(postID, tags){
  return (dispatch) => {
    dispatch({type: POST_RELATED_TAGS_GET});
    var url = '/api/post/get/related/tags';
    return axios.post(url,{tags, postID})
      .then((res)=>{
        dispatch({type: POST_RELATED_TAGS_GET_SUCCESS, posts: res.data.posts});
      }).catch((err)=>{
        dispatch({type: POST_RELATED_TAGS_GET_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
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
    return axios.delete(`/api/post/delete/${postID}`)
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

export function searchPost(word, number = 1, type, category ){
  return (dispatch) => {
    dispatch({type: POST_SEARCH});
    let url = `/api/post/search/${word}/${type}/${number}`;

    if(category){
      url += `/${category}`;
    }
    return axios.get(url)
      .then((res)=>{
        dispatch({type: POST_SEARCH_SUCCESS, results: res.data.results});
      }).catch((err)=>{
        dispatch({type: POST_SEARCH_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
      });
  };
}

export function searchCountPost(word, type, category ){
  return (dispatch) => {
    dispatch({type: POST_SEARCH_COUNT});
    let url = `/api/post/search/count/${word}/${type}`;

    if(category){
      url += `/${category}`;
    }
    return axios.get(url)
      .then((res)=>{
        dispatch({type: POST_SEARCH_COUNT_SUCCESS, count: res.data.count});
      }).catch((err)=>{
        dispatch({type: POST_SEARCH_COUNT_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
      });
  };
}

export function datePost(year, month, number){
  return (dispatch) => {
    dispatch({type: POST_DATE});
    var url = `/api/post/date/${year}/${month}`;
    if(number){
      url += `/${number}`;
    }

    return axios.get(url)
    .then((res)=> {
      dispatch({type: POST_DATE_SUCCESS, posts: res.data.posts});
    }).catch((err)=>{
      dispatch({type: POST_DATE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function dateCountPost(year, month){
  return (dispatch) => {
    dispatch({type: POST_DATE_COUNT});
    var url = `/api/post/date/count/${year}/${month}`;
    return axios.get(url)
    .then((res)=> {
      dispatch({type: POST_DATE_COUNT_SUCCESS, count: res.data.count});
    }).catch((err)=>{
      dispatch({type: POST_DATE_COUNT_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}
