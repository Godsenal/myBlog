import {
  COMMENT_ADD,
  COMMENT_ADD_SUCCESS,
  COMMENT_ADD_FAILURE,
  COMMENT_LIST,
  COMMENT_LIST_SUCCESS,
  COMMENT_LIST_FAILURE,
  COMMENT_UPDATE,
  COMMENT_UPDATE_SUCCESS,
  COMMENT_UPDATE_FAILURE,
  COMMENT_DELETE,
  COMMENT_DELETE_SUCCESS,
  COMMENT_DELETE_FAILURE,
} from './ActionTypes';

import axios from 'axios';

export function addComment(comment){
  return (dispatch) => {
    dispatch({type: COMMENT_ADD});
    return axios.post('api/comment/add',post)
    .then((res)=> {
      dispatch({type: COMMENT_ADD_SUCCESS, comment: res.data.comment});
    }).catch((err)=>{
      dispatch({type: COMMENT_ADD_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function listComment(comment, postID){
  return (dispatch) => {
    dispatch({type: COMMENT_LIST});
    var url = `api/comment/list/${postID}`;
    return axios.get(url)
    .then((res)=> {
      dispatch({type: COMMENT_LIST_SUCCESS, comments: res.data.comments});
    }).catch((err)=>{
      dispatch({type: COMMENT_LIST_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function updateComment(comment){
  return (dispatch) => {
    dispatch({type: COMMENT_UPDATE});
    return axios.post('api/comment/update',comment)
    .then((res)=> {
      dispatch({type: COMMENT_UPDATE_SUCCESS, comment: res.data.comment});
    }).catch((err)=>{
      dispatch({type: COMMENT_UPDATE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}

export function deleteComment(commentID){
  return (dispatch) => {
    dispatch({type: COMMENT_DELETE});
    return axios.post('api/comment/delete',{id: commentID})
    .then((res)=> {
      dispatch({type: COMMENT_DELETE_SUCCESS, comment: res.data.comment});
    }).catch((err)=>{
      dispatch({type: COMMENT_DELETE_FAILURE, err: err.response.data.err, errCode: err.response.data.errCode});
    });
  };
}
