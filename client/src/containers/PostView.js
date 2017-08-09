import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import ReactQuill from 'react-quill';
import Waypoint from 'react-waypoint';
import {Element, animateScroll as scroll, scrollSpy, scroller} from 'react-scroll';
import classNames from 'classnames/bind';

import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import moment from 'moment';

import MdRemoveRedEye from 'react-icons/md/remove-red-eye';
import MdDateRange from 'react-icons/md/date-range';
import MdComment from 'react-icons/md/comment';
import FaArchive from 'react-icons/fa/archive';
import FaCommentO from 'react-icons/lib/fa/comment-o';
import FaTags from 'react-icons/lib/fa/tags';
import FaCaretLeft from 'react-icons/lib/fa/caret-left';
import FaCaretRight from 'react-icons/lib/fa/caret-right';

/*Replace with disqus*/
import {RelatedList, PostSideMenu, PostFixedFooter} from '../components';
import '../../../style/quill/quill.bubble.css';
import {getPost, getPrevPost, getNextPost, getRelatedTagsPost} from '../actions/post';
import {getCategory} from '../actions/category';
import styles from '../../../style/main.css';

import { DiscussionEmbed, CommentCount } from '../disqus';

const thumbnailPath = '/assets/posts/thumbnails/';
const DEFAULT_IMAGE = '/assets/images/back.jpg';
const cx = classNames.bind(styles);

const modules={
  toolbar: false,
};

class PostView extends Component {
  constructor(){
    super();
    this.state={
      isVisible: false,
      isCommentVisible: true,
      isScrollingTop: false,
      snackOpen: false,
      snackMessage: '',
    };
  }
  componentDidMount(){
    //window.addEventListener('scroll',this.handleScroll);
    var {postID}= this.props.params;

    scrollSpy.update();
    if(postID){
      this.loadPost(postID);
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.params.postID !== nextProps.params.postID){
      this.setState({
        isVisible: false,
        isCommentVisible: true,
      });
      this.loadPost(nextProps.params.postID);
    }
  }
  isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  /* Detect ScrollToTop
  handleScroll = () =>{

    let body = document.body;
    let value = body.scrollTop;
    if(this.prevPos > value && !this.state.isScrollingTop){
      console.log('ha');
      this.setState({
        isScrollingTop: true,
      });
    }
    else if(this.prevPos < value && this.state.isScrollingTop){
      this.setState({
        isScrollingTop: false,
      });
    }
    this.prevPos = value;
  }
  */
  handleWaypointEnter = () => {
    this.setState({
      'isVisible': true,
    });
  }
  handleWaypointLeave = () => {
    this.setState({
      'isVisible': false,
    });
  }
  handleCommentWaypointEnter = () => {
    this.setState({
      'isCommentVisible': true,
    });
  }
  handleCommentWaypointLeave = (position) => {
    if(position.currentPosition != 'below'){
      this.setState({
        'isCommentVisible': false,
      });
    }
  }
  handleSnack = (message) => {
    this.setState({
      snackOpen: true,
      snackMessage: message,
    });
  }
  handleSnackClose = () => {
    this.setState({
      snackOpen: false,
    });
  }
  scrollToElement = (elName) => {
    scroller.scrollTo(elName, {
      duration: 500,
      delay: 20,
      smooth: 'easeInOutQuint',
    });

  }
  scrollToTop = () => {
    scroll.scrollToTop();
  }

  scrollToBottom = () => {
    scroll.scrollToBottom();
  }
  handleListClick = () => {
    if(typeof this.props.get.post.category == 'undefined'){
      browserHistory.push(`/category/${this.props.get.post.category}`);
    }
    else{
      browserHistory.push('/category');
    }

  }
  handleTagClick = (tag) => {
    browserHistory.push(`/search/tags/${tag}`);
  }
  handlePathClick = (path) => {
    browserHistory.push(`/category/${path}`);
  }
  handlePushPrev = () => {
    if(this.props.prev.post){
      browserHistory.push(`/post/${this.props.prev.post._id}`);
    }
    else{
      this.handleSnack('이전 글이 없습니다.');
    }

  }
  handlePushNext = () => {
    if(this.props.next.post){
      browserHistory.push(`/post/${this.props.next.post._id}`);
    }
    else{
      this.handleSnack('다음 글이 없습니다.');
    }

  }
  loadPost = (postID) => {
    this.props.getPost(postID)
      .then((res)=>{
        const {status} = this.props.get;
        if(status === 'SUCCESS'){
          this.props.getCategory(this.props.get.post.category);
          this.props.getRelatedTagsPost(postID, this.props.get.post.tags);
          this.props.getPrevPost(postID, this.props.get.post.category);
          this.props.getNextPost(postID, this.props.get.post.category);
        }
        else if(status === 'FAILURE'){
          browserHistory.replace('/NotFound');
        }
        return null;
      })
      .catch((err)=>{
        browserHistory.replace('/NotFound');
      });
  }
  renderPrevNext = () => {
    var buttons = [];
    if(this.props.prev.status === 'SUCCESS'){
      if(!this.isEmpty(this.props.prev.post)){
        let title = this.props.prev.post.title.length > 6 ?
                    this.props.prev.post.title.substr(0,6) + '...' :
                    this.props.prev.post.title;
        buttons.push(
          <div key={0} className={cx('flex1','button')} onTouchTap={this.handlePushPrev}>
            <span className={cx('buttonSubText')}><FaCaretLeft/>Prev </span><span className = {cx('buttonMainText')}>{title}</span>
          </div>
          /*
          <RaisedButton
            key={0}
            onTouchTap={this.handlePushPrev}
            label={title}
            labelStyle={{'color':'#A7FFEB'}}
            style={{'float':'left'}}
            secondary={true}>
            <span style={{'color':'white'}}>&nbsp;{'< Prev'}</span>
          </RaisedButton>*/);
      }
    }
    if(this.props.next.status === 'SUCCESS'){
      if(!this.isEmpty(this.props.next.post)){
        let title = this.props.next.post.title.length > 6?
                    this.props.next.post.title.substr(0,6) + '...' :
                    this.props.next.post.title;
        buttons.push(
          <div key={1} className={cx('flex0','button','marginLeftAuto')} onTouchTap={this.handlePushNext}>
            <span className={cx('buttonMainText')}>{title}</span><span className={cx('buttonSubText')}> Next<FaCaretRight/></span>
          </div>
          /*
          <RaisedButton
            key={1}
            onTouchTap={this.handlePushNext}
            label={title}
            labelStyle={{'color':'#A7FFEB'}}
            labelPosition='before'
            style={{'float':'right'}}
            secondary={true}>
            <span style={{'color':'white'}}>{'Next >'}&nbsp;</span>
          </RaisedButton>*/);
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
    const {screenWidth} = this.props.environment;
    const isMobile = screenWidth < 1000;
    var category = this.props.categoryGet.category;
    var path = !this.isEmpty(category) ? category.path ? category.path.split(',').filter(el=>el.length != 0).concat([category.name]) : [category.name] : null;
    //var path = !this.isEmpty(category) && category.path ?category.path.replace(new RegExp(',', 'g'), '/') + category.name:null;
    return(
      <div>
        <div className={isMobile?null:styles.postContainer}>
          <Paper className={isMobile?styles.mobilePaperContainer:styles.paperContainer} zDepth={0} >
            <div style={{'textAlign': 'left'}}>
              <span className={styles.postTitle} style={{color:'#454545'}}>{post.title}</span>
                <div className={cx('subHeader','textRight')} >
                  <span style={{color:'#E74C3C'}}>
                    <FaArchive/>
                    {path?path.map((el,i)=>{
                      return <span key={i} onClick={() => this.handlePathClick(el)}><span>/</span><span className={styles.path}>{el}</span></span>;
                    }):null}
                  </span>&nbsp;
                  <span>
                    <MdDateRange/>
                    {moment(post.created).format('LL')}
                  </span>&nbsp;
                  <span>
                    <MdRemoveRedEye/>
                    {post.viewer}
                  </span>&nbsp;
                  <span style={{color:'#E74C3C'}}>
                    <MdComment/>
                    <span className={styles.path} onClick={()=>this.scrollToElement('disqusContainer')}>
                      <CommentCount shortname={disqusShortname} config={disqusConfig}>
                        0
                      </CommentCount>
                    </span>
                  </span>
                </div>
              <Divider style={{'marginTop':'1.5rem','marginBottom':'1.5rem'}}/>
              <img
                src={post.thumbnail? thumbnailPath + post.thumbnail : DEFAULT_IMAGE }
                style={{'width':'100%'}}
                onError={(e)=>e.target.src = DEFAULT_IMAGE} />
            </div>
            <div style={{'marginTop': '1rem'}}>
              <ReactQuill
                theme='bubble'
                modules={modules}
                readOnly={true}
                value={post.content}
                >
              </ReactQuill>
            </div>
            <div className={styles.author}>
              <div style={{'float':'right'}}>
                <Avatar style={{display: 'block'}} size={60} src='/assets/images/profile.jpg'/>
              </div>
              <div>
                <span style={{marginRight: '0.7rem'}}>{post.author}</span><br/>
                <span style={{marginRight: '0.7rem',color:'rgba(0,0,0,.44)'}}>공익</span><br/>
                <span style={{marginRight: '0.7rem','color':'rgba(0,0,0,.44)'}}>컴퓨터 배우는 중</span><br/>
              </div>
            </div>
            <Divider style={{'marginTop':'1.5rem','marginBottom':'1.5rem'}}/>
              <div className={styles.tagContainer}>
                <span><FaTags/></span>&nbsp;
                {'tags' in post ?
                  post.tags.map((tag,i)=>{
                    return <span key={i}><span className={styles.tags} onClick={() => this.handleTagClick(tag)}>{tag}</span>{i!=post.tags.length-1?' /':''}&nbsp;</span>;
                  }):null
                }
              </div>
            <div className={styles.buttonContainer}>
              {this.renderPrevNext()}
            </div>
            <div style={{'marginTop':'2rem'}}>
              <Waypoint
                onEnter={this.handleCommentWaypointEnter}
                onLeave={this.handleCommentWaypointLeave}
              />
              <Element name='disqusContainer'>
                <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
              </Element>
            </div>
          </Paper>
          {
            (this.props.relatedTags.status === 'SUCCESS') && this.props.relatedTags.posts.length > 0 ?
            <RelatedList
              type='tags'
              posts={this.props.relatedTags.posts}
              isMobile={isMobile}
            />:null
          }
        </div>
        {isMobile?
          <div className={styles.fixedPhantom} >
            <FaCommentO className={styles.fixedFooterMenuItemLeft}/>
          </div>:null}
        {!isMobile?
          this.state.isCommentVisible?
          <PostSideMenu
            isCommentVisible={this.state.isCommentVisible}
            scrollToTop={this.scrollToTop}
            scrollToBottom={this.scrollToBottom}
            handleListClick={this.handleListClick} />
          :null:null
          /*
          <div className={styles.fixedUpButton}>
            <span className={styles.fixedSideMenuItem}><FaAngleUp onClick={this.scrollToTop}/></span>
          </div>*/
        }
        {
          isMobile?
          <PostFixedFooter
            scrollToTop={this.scrollToTop}
            scrollToBottom={this.scrollToBottom}
            handleListClick={this.handleListClick} />:null
        }
        <Snackbar
          open={this.state.snackOpen}
          message={this.state.snackMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackClose}
        />
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
        {get.status === 'SUCCESS' && get.post?
          this.renderPost(get.post)
          : get.status === 'FAILURE'?
          this.renderFail():null}
      </div>
    );
  }
}

PostView.defaultProps ={
  params: {},
  get: {},
  prev: {},
  next: {},
  relatedTags: {},
  categoryGet: {},
  getPost : () => {console.log('PostView props Error');},
  getPrevPost : () => {console.log('PostView props Error');},
  getNextPost : () => {console.log('PostView props Error');},
  getRelatedTagsPost: () => {console.log('PostView props Error');},
  getCategory : () => {console.log('PostView props Error');},
  isMobile : false,
};
PostView.propTypes = {
  params: PropTypes.object.isRequired,
  get: PropTypes.object.isRequired,
  prev: PropTypes.object.isRequired,
  next: PropTypes.object.isRequired,
  relatedTags: PropTypes.object.isRequired,
  categoryGet: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
  getPrevPost: PropTypes.func.isRequired,
  getNextPost: PropTypes.func.isRequired,
  getRelatedTagsPost: PropTypes.func.isRequired,
  getCategory: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  environment: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    activeCategory: state.category.activeCategory,
    get: state.post.get,
    prev: state.post.prev,
    next: state.post.next,
    relatedTags: state.post.related.tags,
    categoryGet: state.category.get,
    environment: state.environment,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getPost: (postID) => {
      return dispatch(getPost(postID));
    },
    getPrevPost: (postID, categoryName) => {
      return dispatch(getPrevPost(postID, categoryName));
    },
    getNextPost: (postID, categoryName) => {
      return dispatch(getNextPost(postID, categoryName));
    },
    getRelatedTagsPost: (postID, tags) => {
      return dispatch(getRelatedTagsPost(postID, tags));
    },
    getCategory: (categoryName) => {
      return dispatch(getCategory(categoryName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
