import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import {Motion, spring} from 'react-motion';
import moment from 'moment';

import {Card, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import MdRemoveRedEye from 'react-icons/md/remove-red-eye';
import MdDateRange from 'react-icons/md/date-range';
import MdComment from 'react-icons/md/comment';

import { CommentCount } from '../disqus';

const thumbnailPath = '/assets/posts/thumbnails/';
const DEFAULT_IMAGE = '/assets/images/back.jpg';

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
        marginTop: 100,
        zIndex: 1,
      },
      style:{
        scale: spring(this.state.isHover===index ? 1.2 : 1),
        marginTop: spring(0, {stiffness: 100, damping: 10}),
        zIndex: spring(this.state.isHover===index ? 2 : 1),
      },
    };
  }

  render(){
    const disqusShortname = 'godsenal';
    const {isMobile, posts} = this.props;
    return(
      <GridList
        cols={isMobile?1:2}
        cellHeight={450}
        padding={10}
        style={inlineStyles.gridList}>
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
                marginTop: interpolatingStyle.marginTop,
              };
              return(

                  <GridTile style={{'cursor': 'pointer'}} onTouchTap={ () => this.handlePostClick(post._id)}>
                    <Card
                      onMouseOver={()=>{this.handleHover(i);}}
                      onMouseOut={()=>{this.handleHover(false);}}>
                      <CardMedia style={style}>
                        <img src={thumbnailPath + post.thumbnail} style={{'height':'200px'}} onError={(e)=>e.target.src = DEFAULT_IMAGE} />
                      </CardMedia>
                      <CardTitle title={post.title}/>
                      <CardText style={{'textAlign':'right'}}>
                        <h3 style={{'float':'left','display':'inline'}}>
                          <Avatar backgroundColor={'#32FAE2'}>{post.author.substr(0,1).toUpperCase()}</Avatar>&nbsp;{post.author}
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
                  </GridTile>);
            }}
          </Motion>);
      })}
      </GridList>
    );
  }
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  isMobile: PropTypes.bool.isRequired,
};
export default PostList;
