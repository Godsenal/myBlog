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

/*Replace with disqus*/
//import {Comment} from '../components';
import {getPost} from '../actions/post';
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
      this.props.getPost(postID);
    }
  }
  componentDidUpdate(prevProps, prevState) {
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
          <RaisedButton label="< 이전 글" style={{'float':'left'}} secondary={true}/>
          <RaisedButton label="다음 글 >" style={{'float':'right'}} secondary={true}/>
        </div>
        <div style={{'overflow':'hidden','marginTop':'3rem'}}>
          <RaisedButton label="추천" style={{'float':'right'}} primary={true} icon={<FaStar/>}/>
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
  getPost : () => {console.log('PostView props Error');},
};
PostView.propTypes = {
  params: PropTypes.object.isRequired,
  get: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    get: state.post.get,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getPost: (postID) => {
      return dispatch(getPost(postID));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
