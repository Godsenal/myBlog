import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import ReactQuill from 'react-quill';
import Waypoint from 'react-waypoint';
import Scroll,{Link, Element, Events, animateScroll as scroll, scrollSpy, scroller} from 'react-scroll';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import moment from 'moment';

import MdRemoveRedEye from 'react-icons/md/remove-red-eye';
import MdDateRange from 'react-icons/md/date-range';
import MdComment from 'react-icons/md/comment';
import FaArchive from 'react-icons/fa/archive';
import FaCommentO from 'react-icons/lib/fa/comment-o';
import FaHandODown from 'react-icons/lib/fa/hand-o-down';
import FaAngleUp from 'react-icons/lib/fa/angle-up';
import FaAngleDown from 'react-icons/lib/fa/angle-down';

/*Replace with disqus*/
//import {Comment} from '../components';
import 'react-quill/dist/quill.bubble.css';
import {getPost, getPrevPost, getNextPost} from '../actions/post';
import {getCategory} from '../actions/category';
import styles from '../../../style/main.css';

import { DiscussionEmbed, CommentCount } from '../disqus';

const thumbnailPath = '/assets/posts/thumbnails/';
const DEFAULT_IMAGE = '/assets/images/back.jpg';

const modules={
  toolbar: false,
};

class PostView extends Component {
  constructor(){
    super();
    this.state={
      isVisible: false,
      isCommentVisible: false,
    };
  }
  componentDidMount(){
    var {postID}= this.props.params;
    if(postID){
      this.loadPost(postID);
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.params.postID !== nextProps.params.postID){
      this.setState({
        isVisible: false,
        isCommentVisible: false,
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
  handleCommentWaypointLeave = () => {
    this.setState({
      'isCommentVisible': false,
    });
  }
  scrollToElement = (elName) => {
    scroller.scrollTo(elName, {
      duration: 1500,
      delay: 100,
      smooth: 'easeInOutQuint',
    });

  }
  scrollToTop = () => {
    scroll.scrollToTop();
  }

  scrollToBottom = () => {
    scroll.scrollToBottom();
  }

  loadPost = (postID) => {
    this.props.getPost(postID)
      .then(()=>{
        this.props.getCategory(this.props.get.post.category);
        this.props.getPrevPost(postID, this.props.get.post.category);
        this.props.getNextPost(postID, this.props.get.post.category);
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
          <RaisedButton
            key={0}
            onTouchTap={()=>browserHistory.push(`/post/${this.props.prev.post._id}`)}
            label={title}
            labelStyle={{'color':'#A7FFEB'}}
            style={{'float':'left'}}
            secondary={true}>
            <span style={{'color':'white'}}>&nbsp;{'< Prev'}</span>
          </RaisedButton>);
      }
    }
    if(this.props.next.status === 'SUCCESS'){
      if(!this.isEmpty(this.props.next.post)){
        let title = this.props.next.post.title.length > 6 ?
                    this.props.next.post.title.substr(0,6) + '...' :
                    this.props.next.post.title;
        buttons.push(
          <RaisedButton
            key={1}
            onTouchTap={()=>browserHistory.push(`/post/${this.props.next.post._id}`)}
            label={title}
            labelStyle={{'color':'#A7FFEB'}}
            labelPosition='before'
            style={{'float':'right'}}
            secondary={true}>
            <span style={{'color':'white'}}>{'Next >'}&nbsp;</span>
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
    const {screenWidth} = this.props.environment;
    const isMobile = screenWidth < 1000;
    var category = this.props.categoryGet.category;
    var path = !this.isEmpty(category) && category.path ?category.path.replace(new RegExp(',', 'g'), '/') + category.name:null;
    return(
      <div>
        <div className={this.props.isMobile?null:styles.postContainer}>
          <Paper className={this.props.isMobile?styles.mobilePaperContainer:styles.paperContainer} zDepth={3} >
            <div style={{'textAlign': 'center'}}>
              <h2 style={{'fontSize':'1.7em'}}>{post.title}</h2>
              <Subheader style={{'textAlign': 'right','fontSize':'0.7em'}}>
                <div style={{'color':'rgba(0, 0, 0, 0.4)','margin':0}}>
                  <span>
                    <FaArchive/>
                    {path}
                  </span>&nbsp;
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
                </div>
              </Subheader>
              <img
                src={post.thumbnail? thumbnailPath + post.thumbnail : DEFAULT_IMAGE }
                style={{'width':'100%'}}
                onError={(e)=>e.target.src = DEFAULT_IMAGE} />
            </div>
            <div style={{'marginTop': '1rem'}}>
              <Waypoint
                onEnter={this.handleWaypointEnter}
                onLeave={this.handleWaypointLeave}
              />
              <ReactQuill
                theme='bubble'
                modules={modules}
                readOnly={true}
                value={post.content}>
              </ReactQuill>
            </div>
            <div style={{'marginTop':'3rem','textAlign':'right'}}>
              <div style={{'float':'right'}}>
                <Avatar style={{display: 'block'}} size={60} src='/assets/images/profile.jpg'/>
              </div>
              <div>
                <span style={{marginRight: '0.7rem'}}>{post.author}</span><br/>
                <span style={{marginRight: '0.7rem','fontSize':'0.8em','color':'rgba(0,0,0,.44)'}}>공익</span><br/>
                <span style={{marginRight: '0.7rem','fontSize':'0.8em','color':'rgba(0,0,0,.44)'}}>컴퓨터 배우는 중</span><br/>
              </div>
            </div>
            <Divider style={{'marginTop':'3rem','marginBottom':'3rem'}}/>
            <div style={{'overflow':'hidden'}}>
              {this.renderPrevNext()}
            </div>
            <div style={{'marginTop':'2rem'}}>
              <Element name='disqusContainer'>
                <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
              </Element>
            </div>
            <Waypoint
              onEnter={this.handleCommentWaypointEnter}
              onLeave={this.handleCommentWaypointLeave}
            />
          </Paper>
        </div>
        {!isMobile?
          this.state.isVisible?
          <div className={styles.fixedSideMenu}>
            <p><span style={{fontSize:'0.5em'}}>MOVE</span></p>
            <p className={styles.fixedSideMenuItem}><FaAngleUp onClick={this.scrollToTop}/></p>
            <Link className={styles.fixedSideMenuItem} to='disqusContainer' spy={true} smooth={true} offset={50} duration={500}>
              <FaCommentO/>
            </Link>
            <p className={styles.fixedSideMenuItem}><FaAngleDown onClick={this.scrollToBottom}/></p>
          </div>
          :
          <div className={styles.fixedUpButton}>
            <p><span style={{fontSize:'0.5em'}}>MOVE</span></p>
            <p className={styles.fixedSideMenuItem}><FaAngleUp onClick={this.scrollToTop}/></p>
          </div>
          :
          !this.state.isCommentVisible?
          <div className={styles.fixedFooter}>
            <Link className={styles.fixedFooterMenuItemLeft} to='disqusContainer' spy={true} smooth={true} offset={50} duration={500}>
              <FaCommentO/>
            </Link>
            <span className={styles.fixedFooterMenuItemRight} >
              <FaAngleDown className={styles.fixedSideMenuItem} onClick={this.scrollToBottom}/>
              <FaAngleUp className={styles.fixedSideMenuItem} onClick={this.scrollToTop}/>
            </span>
          </div>:null
        }
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
  categoryGet: {},
  getPost : () => {console.log('PostView props Error');},
  getPrevPost : () => {console.log('PostView props Error');},
  getNextPost : () => {console.log('PostView props Error');},
  getCategory : () => {console.log('PostView props Error');},
  isMobile : false,
};
PostView.propTypes = {
  params: PropTypes.object.isRequired,
  get: PropTypes.object.isRequired,
  prev: PropTypes.object.isRequired,
  next: PropTypes.object.isRequired,
  categoryGet: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
  getPrevPost: PropTypes.func.isRequired,
  getNextPost: PropTypes.func.isRequired,
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
    getCategory: (categoryName) => {
      return dispatch(getCategory(categoryName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
