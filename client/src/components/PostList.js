import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import {Motion, spring} from 'react-motion';
import moment from 'moment';

import {Card, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridTile} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import MdRemoveRedEye from 'react-icons/md/remove-red-eye';
import MdDateRange from 'react-icons/md/date-range';
import MdComment from 'react-icons/md/comment';
import StackGrid from 'react-stack-grid';

import { CommentCount } from '../disqus';
import styles from '../../../style/main.css';

const thumbnailPath = '/assets/posts/thumbnails/';
const DEFAULT_IMAGE = '/assets/images/back.jpg';


const disqusShortname = 'godsenal';

const inlineStyles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    overflowY: 'auto',
  },
};

class PostList extends Component{
  constructor(props){
    super(props);
    this.state = {
      isHover: false,
    };
  }
  componentDidMount() {
    window.addEventListener('resize',this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize',this.handleResize);
  }
  handleResize = () => {
    if(this.grid){
      this.grid.updateLayout();
    }
  }
  handlePostClick = (postID) => {
    browserHistory.push(`/post/${postID}`);
  }
  handleHover = (active) => {
    this.setState({isHover: active});
  }

  getPostSpringProps = (index) => {
    return {
      defaultStyle: {
        scale: 1,
        y: 100,
        zIndex: 1,
      },
      style:{
        scale: spring(this.state.isHover===index ? 1.2 : 1),
        y: spring(0,{stiffness: 160, damping: 5}),
        zIndex: spring(this.state.isHover===index ? 2 : 1),
      },
    };
  }
  renderDesktop = (columnWidth, posts) => {
    return (
      <StackGrid
        columnWidth={columnWidth}
        gridRef={grid => this.grid = grid}
        gutterWidth={20}
        gutterHeight={10}
        monitorImagesLoaded={true}
        duration={700}
      >
      {posts.map((post, i)=>{
        var disqusConfig = {
          //url: `http://www.godsenal.com/#${disqusShortname}`,
          identifier: post._id,
          title: post.title,
        };
        return (
          <Motion key={i} {...this.getPostSpringProps(i)}>
            {interpolatingStyle => {
              let style = {
                transform: 'scale(' + interpolatingStyle.scale + ')',
                verticalAlign: 'middle',
              };
              let text = post.text?post.text.length > 200 ? post.text.substr(0,200) + '...' : post.text : '';
              return(
                <Paper zDepth={3} style={{'borderRadius': 10,marginTop: 10}}>
                  <GridTile style={{'cursor': 'pointer', 'borderRadius':10}} onTouchTap={ () => this.handlePostClick(post._id)}>
                    <Card
                      onMouseEnter={()=>{this.handleHover(i);}}
                      onMouseLeave={()=>{this.handleHover(false);}}>
                      <CardMedia style={{'display':'inline-block','overflow':'hidden'}}>
                        <img className={styles.postImage} style={style} src={post.thumbnail? thumbnailPath + post.thumbnail : null } onError={(e)=>e.target.src = DEFAULT_IMAGE} />
                      </CardMedia>
                      <CardTitle><span className={styles.postCardTitle}>{post.title}</span></CardTitle>
                      <CardText>
                        <span className={styles.postText}>{text}</span>
                      </CardText>
                      <CardText style={{'textAlign':'right'}}>
                        <h3 style={{'float':'left','display':'inline'}}>
                          <Avatar backgroundColor={'#32FAE2'} size={16}>{post.author?post.author.substr(0,1).toUpperCase():''}</Avatar>&nbsp;{post.author}
                        </h3>
                        <h5>
                          <MdDateRange/>
                          {moment(post.created).format('LL')}
                        </h5>&nbsp;
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
                      </CardText>
                    </Card>
                  </GridTile>
                </Paper>);
            }}
          </Motion>);
      })}
    </StackGrid>
    );
  }
  renderMobile = (posts) => {
    return (
      <div style={{maxWidth:'100%'}}>
      {posts.map((post, i)=>{
        var disqusConfig = {
          //url: `http://www.godsenal.com/#${disqusShortname}`,
          identifier: post._id,
          title: post.title,
        };
        return (
          <Motion key={i} {...this.getPostSpringProps(i)}>
            {interpolatingStyle => {
              const {scale, y} = interpolatingStyle;
              let style = {
                transform: 'scale(' + scale + ')',
                verticalAlign: 'middle',
              };

              let containerStyle = {
                WebkitTransform: `translate3d(0, ${y}px, 0)`,
                transform: `translate3d(0, ${y}px, 0)`,
                borderRadius: 10,
                marginTop: 10
              };
              let text = post.text?post.text.length > 200 ? post.text.substr(0,200) + '...' : post.text : '';
              return(
                <Paper zDepth={3} style={containerStyle}>
                  <GridTile style={{'cursor': 'pointer', 'borderRadius':10}} onTouchTap={ () => this.handlePostClick(post._id)}>
                    <Card
                      onMouseEnter={()=>{this.handleHover(i);}}
                      onMouseLeave={()=>{this.handleHover(false);}}>
                      <CardMedia style={{'display':'inline-block','overflow':'hidden'}}>
                        <img className={styles.postImage} style={style} src={post.thumbnail? thumbnailPath + post.thumbnail : null } onError={(e)=>e.target.src = DEFAULT_IMAGE} />
                      </CardMedia>
                      <CardTitle><span className={styles.postCardTitle}>{post.title}</span></CardTitle>
                      <CardText >
                        <span className={styles.postText}>{text}</span>
                      </CardText>
                      <CardText style={{'textAlign':'right'}}>
                        <h3 style={{'float':'left','display':'inline'}}>
                          <Avatar backgroundColor={'#32FAE2'} size={16}>{post.author?post.author.substr(0,1).toUpperCase():''}</Avatar>&nbsp;{post.author}
                        </h3>
                        <h5>
                          <MdDateRange/>
                          {moment(post.created).format('LL')}
                        </h5>&nbsp;
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
                      </CardText>
                    </Card>
                  </GridTile>
                </Paper>);
            }}
          </Motion>);
      })}
    </div>
    );
  }
  render(){
    const {isMobile, posts, screenWidth} = this.props;
    const columnWidth = screenWidth > 1500 ? '30%': screenWidth > 800 ? '50%' : '100%';
    return(
      screenWidth > 800 ? this.renderDesktop(columnWidth, posts):this.renderMobile(posts)
    );
  }
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  isMobile: PropTypes.bool.isRequired,
  screenWidth: PropTypes.number.isRequired,
};
export default PostList;
