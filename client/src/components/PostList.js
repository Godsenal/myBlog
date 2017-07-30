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
  componentDidMount() {
    window.addEventListener('resize',this.handleResize);
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
        zIndex: 1,
      },
      style:{
        scale: spring(this.state.isHover===index ? 1.2 : 1),
        zIndex: spring(this.state.isHover===index ? 2 : 1),
      },
    };
  }

  render(){
    const disqusShortname = 'godsenal';
    const {isMobile, posts, screenWidth} = this.props;
    const columnWidth = screenWidth > 1500 ? '30%': screenWidth > 800 ? '50%' : '100%';
    return(
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
                        <img style={style} src={post.thumbnail? thumbnailPath + post.thumbnail : null } onError={(e)=>e.target.src = DEFAULT_IMAGE} />
                      </CardMedia>
                      <CardTitle style={{'lineHeight':'1.2','fontWeight':700,'fontSize':20}} title={post.title}/>
                      <CardText style={{'fontSize':'0.8em','color':'rgba(0,0,0,.44)'}}>
                        <span>{text}</span>
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
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  isMobile: PropTypes.bool.isRequired,
  screenWidth: PropTypes.number.isRequired,
};
export default PostList;
