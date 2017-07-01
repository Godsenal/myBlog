import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ReactQuill from 'react-quill';

import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

import MdRemoveRedEye from 'react-icons/md/remove-red-eye';
import MdDateRange from 'react-icons/md/date-range';
import MdComment from 'react-icons/md/comment';
import FaStar from 'react-icons/fa/star';
import FaAngleDoublerLeft from 'react-icons/fa/angle-double-left';

/*Replace with disqus*/
//import {Comment} from '../components';
import {getPost, getPrevPost, getNextPost} from '../actions/post';
import styles from '../../../style/main.css';

import { DiscussionEmbed, CommentCount } from '../disqus';

const modules={
  toolbar: false,
};

class PostView extends Component {
  constructor(){
    super();
  }
  componentDidMount(){
    var {postID}= this.props.params;
    if(postID){
      this.loadPost(postID);
    }
  }
  isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  loadPost = (postID) => {
    this.props.getPost(postID)
      .then(()=>{
        this.props.getPrevPost(postID);
        this.props.getNextPost(postID);
      });
  }
  renderPrevNext = () => {
    var buttons = [];
    if(this.props.prev.status === 'SUCCESS'){
      if(!this.isEmpty(this.props.prev.post)){
        buttons.push(
          <RaisedButton
            key={0}
            onTouchTap={()=>this.loadPost(this.props.prev.post._id)}
            label={this.props.prev.post.title}
            labelStyle={{'color':'#A7FFEB'}}
            style={{'float':'left'}}
            secondary={true}>
            <span style={{'color':'white'}}>&nbsp;{'< 이전 글'}</span>
          </RaisedButton>);
      }
    }
    if(this.props.next.status === 'SUCCESS'){
      if(!this.isEmpty(this.props.next.post)){
        buttons.push(
          <RaisedButton
            key={1}
            onTouchTap={()=>this.loadPost(this.props.next.post._id)}
            label={this.props.next.post.title}
            labelStyle={{'color':'#A7FFEB'}}
            labelPosition='before'
            style={{'float':'right'}}
            secondary={true}>
            <span style={{'color':'white'}}>{'다음 글 >'}&nbsp;</span>
          </RaisedButton>);
      }
    }
    return buttons;
  }
  renderPost = (post) => {
    const disqusShortname = 'godsenal';
    const disqusConfig = {
      //url: `http://www.godsenal.com/#${disqusShortname}`,
      identifier: post._id,
      title: post.title,
    };
    return(
      <div className={styles.postContainer}>
        <div style={{'textAlign': 'center'}}>
            <img src="/assets/images/back.jpg" style={{'width':'100%','maxHeight':300}} alt="" />
          <h1>{post.title}</h1>
          <Subheader style={{'textAlign': 'right'}}>
            <h3><Avatar>{post.author.substr(0,1).toUpperCase()}</Avatar>&nbsp;{post.author}</h3>
            <span>
              <MdDateRange/>
              {moment(post.created).format('LL')}
            </span>&nbsp;
            <span>
              <MdRemoveRedEye/>
              {post.viewer}
            </span>&nbsp;
            <span>
              <MdComment/>
              <CommentCount shortname={disqusShortname} config={disqusConfig}>
                0
              </CommentCount>
            </span>
          </Subheader>

        </div>
        <ReactQuill
          modules={modules}
          readOnly={true}
          value={post.content}>
        </ReactQuill>
        <Divider style={{'marginTop':'3rem','marginBottom':'3rem'}}/>
        <div style={{'overflow':'hidden'}}>
          {this.renderPrevNext()}
        </div>
        <div style={{'marginTop':'2rem'}}>
          <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </div>
      </div>
    );
  }
  renderProgress = () =>{
    return(
    <div className={styles.centerContainer}>
      <h1>페이지를 찾는 중입니다...</h1>
      <CircularProgress size={100} thickness={7} />
    </div>);
  }
  renderFail = () => {
    return(
    <div className={styles.centerContainer}>
      <h1>페이지를 찾을 수 없습니다.</h1>
    </div>);
  }
  render () {
    const {get} = this.props;
    return(
      <div>
        {get.status === 'SUCCESS'?
          this.renderPost(get.post)
          : get.status === 'FAILURE'?
          this.renderFail()
          :this.renderProgress()}
      </div>
    );
  }
}

PostView.defaultProps ={
  params: {},
  get: {},
  prev: {},
  next: {},
  getPost : () => {console.log('PostView props Error');},
  getPrevPost : () => {console.log('PostView props Error');},
  getNextPost : () => {console.log('PostView props Error');},
};
PostView.propTypes = {
  params: PropTypes.object.isRequired,
  get: PropTypes.object.isRequired,
  prev: PropTypes.object.isRequired,
  next: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
  getPrevPost: PropTypes.func.isRequired,
  getNextPost: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    get: state.post.get,
    prev: state.post.prev,
    next: state.post.next,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getPost: (postID) => {
      return dispatch(getPost(postID));
    },
    getPrevPost: (postID) => {
      return dispatch(getPrevPost(postID));
    },
    getNextPost: (postID) => {
      return dispatch(getNextPost(postID));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
