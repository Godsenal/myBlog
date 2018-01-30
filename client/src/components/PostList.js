import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import {Motion, spring} from 'react-motion';
import moment from 'moment';
import classNames from 'classnames/bind';

import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridTile} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import MdRemoveRedEye from 'react-icons/md/remove-red-eye';
import MdDateRange from 'react-icons/md/date-range';
import MdComment from 'react-icons/md/comment';
import StackGrid from 'react-stack-grid';

import { CommentCount } from '../disqus';
import styles from '../../../style/PostList.scss';

const thumbnailPath = '/assets/posts/thumbnails/';
const DEFAULT_IMAGE = '/assets/images/back.jpg';


const cx = classNames.bind(styles);

const disqusShortname = 'godsenal';



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
  handleCategoryClick = (category) => {
    browserHistory.push(`/category/${category}`);
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
      <div>
        {posts.map((post, i)=>{
          let text = post.text?post.text.length > 100 ? post.text.substr(0,100) + '...' : post.text : '';
          return(
            <div key={i}>
              <div className={cx('listContainer')}>
                <div 
                  className={cx('thumbnailContainer')} 
                  onTouchTap={ () => this.handlePostClick(post._id)}
                  onMouseEnter={()=>{this.handleHover(i);}}
                  onMouseLeave={()=>{this.handleHover(false);}}>
                  <Motion {...this.getPostSpringProps(i)}>
                    {interpolatingStyle => {
                      const {scale} = interpolatingStyle;
                      let style = {
                        transform: 'scale(' + scale + ')',
                        verticalAlign: 'middle',
                      };
                      return <img className={cx('thumbnail')} style={style} src={post.thumbnail? thumbnailPath + post.thumbnail : DEFAULT_IMAGE } onError={(e)=>e.target.src = DEFAULT_IMAGE} />
                    }}
                  </Motion>
                </div>
                <div className={cx('contentsContainer')}>
                  <div className={cx('categoryContainer')}>
                    <div>
                      <span className={cx('category-text')} onTouchTap={()=>this.handleCategoryClick(post.category)}>{post.category}</span>
                    </div>
                  </div>
                  <div className={cx('title')}>
                    <span onTouchTap={ () => this.handlePostClick(post._id)}>{post.title}</span>
                    </div>
                  <div className={cx('contents')}>
                    <span onTouchTap={ () => this.handlePostClick(post._id)}>{text}</span>
                  </div>
                  <div className={cx('created-text')}>
                    {moment(post.created).format('LL')}
                  </div>
                </div>
              </div>
              <div className={cx('divider')}/>
            </div>
          );
        })}
      </div>
    );
  }
  renderMobile = (posts) => {
    return (
      <div className={styles.mobileGridContainer}>
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
                borderRadius: 5,
                marginTop: 10
              };
              let text = post.text?post.text.length > 200 ? post.text.substr(0,200) + '...' : post.text : '';
              return(
                <Paper zDepth={3} style={containerStyle}>
                  <GridTile style={{'cursor': 'pointer', 'borderRadius':5}} onTouchTap={ () => this.handlePostClick(post._id)}>
                    <Card
                      onMouseEnter={()=>{this.handleHover(i);}}
                      onMouseLeave={()=>{this.handleHover(false);}}>
                      <CardMedia style={{'display':'inline-block','overflow':'hidden',width: '100%'}}>
                        <img className={styles.postImage} style={style} src={post.thumbnail? thumbnailPath + post.thumbnail : null } onError={(e)=>e.target.src = DEFAULT_IMAGE} />
                      </CardMedia>
                      <CardTitle><span className={styles.postCardTitle}>{post.title}</span></CardTitle>
                      <CardText >
                        <span className={styles.postText}>{text}</span>
                      </CardText>
                      <CardText>
                        <div className={cx('postCardFooter')}>
                          <div className={cx('flex0','postCardFooterLeft')}>
                            <Avatar backgroundColor={'#32FAE2'} size={16}>{post.author?post.author.substr(0,1).toUpperCase():''}</Avatar>{post.author}
                          </div>
                          <div className={cx('flex1','postCardFooterRight')}>
                            <MdDateRange/>
                            {moment(post.created).format('LL')}
                            <br/>
                            <MdRemoveRedEye/>
                            {post.viewer}
                            <MdComment/>
                            <CommentCount className={cx('disqusCount')} shortname={disqusShortname} config={disqusConfig}>
                              0
                            </CommentCount>
                          </div>
                        </div>
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
    const {posts, screenWidth} = this.props;
    const columnWidth = screenWidth > 1500 ? '30%': screenWidth > 800 ? '50%' : '100%';
    return(
      screenWidth > 999 ? this.renderDesktop(columnWidth, posts):this.renderMobile(posts)
    );
  }
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  isMobile: PropTypes.bool.isRequired,
  screenWidth: PropTypes.number.isRequired,
};
export default PostList;
