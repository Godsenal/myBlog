import {
  POST_ADD,
  POST_ADD_SUCCESS,
  POST_ADD_FAILURE,
  POST_LIST,
  POST_LIST_SUCCESS,
  POST_LIST_FAILURE,
  POST_UPDATE,
  POST_UPDATE_SUCCESS,
  POST_UPDATE_FAILURE,
  POST_DELETE,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAILURE,
} from './ActionTypes';

import axios from 'axios';

export function addPost(post){
  return (dispatch) => {
    dispatch({type: POST_ADD});
    return axios.post('api/post/add',post)
    .then((res)=> {
      dispatch({type: POST_ADD_SUCCESS, post: res.data.post});
    }).catch((err)=>{
      dispatch({type: POST_ADD_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function listPost(post, category){
  return (dispatch) => {
    dispatch({type: POST_LIST});
    var url = `api/post/list/${category}`;
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
    return axios.post('api/post/update',post)
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
    return axios.post('api/post/delete',{id: postID})
    .then((res)=> {
      dispatch({type: POST_DELETE_SUCCESS, post: res.data.post});
    }).catch((err)=>{
      dispatch({type: POST_DELETE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}
