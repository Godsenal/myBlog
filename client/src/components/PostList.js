import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Motion, spring} from 'react-motion';
import moment from 'moment';

import {Card, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import MdRemoveRedEye from 'react-icons/md/remove-red-eye';
import MdDateRange from 'react-icons/md/date-range';
import MdComment from 'react-icons/md/comment';

import { CommentCount } from '../disqus';

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
                <Link to={`/post/${post._id}`} style={{'textDecoration':'none'}}>
                  <GridTile>
                    <Card
                      onMouseOver={()=>{this.handleHover(i);}}
                      onMouseOut={()=>{this.handleHover(false);}}>
                      <CardMedia style={style}>
                        <img src="/assets/images/back.jpg" style={{'height':'200px'}} alt="" />
                      </CardMedia>
                      <CardTitle title={post.title}/>
                        <CardHeader
                          title={post.author}
                          subtitle="Subtitle"
                          avatar="/assets/images/profile.jpg"
                        />
                      <CardText style={{'textAlign':'right'}}>
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
                </Link>);
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
