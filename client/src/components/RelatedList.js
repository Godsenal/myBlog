import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import {Motion, spring} from 'react-motion';
import moment from 'moment';
import classNames from 'classnames/bind';

import {Card,  CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridTile} from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import MdDateRange from 'react-icons/md/date-range';
const thumbnailPath = '/assets/posts/thumbnails/';
const DEFAULT_IMAGE = '/assets/images/back.jpg';

import styles from '../../../style/main.css';


const cx = classNames.bind(styles);

class RelatedList extends Component{
  constructor(props){
    super(props);
    this.state = {
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
        zIndex: 1,
      },
      style:{
        scale: spring(this.state.isHover===index ? 1.2 : 1),
        zIndex: spring(this.state.isHover===index ? 2 : 1),
      },
    };
  }

  render(){
    const {posts, isMobile} = this.props;
    const tileWidth = isMobile?'100%':'30%';
    return(
      <div className={styles.relatedListContainer}>
        <div className={styles.tileHeader}>RELATED POSTS</div>
        <div className={styles.tileContainer}>
        {posts.map((post, i)=>{
          return (
            <Motion key={i} {...this.getPostSpringProps(i)}>
              {interpolatingStyle => {
                let style = {
                  transform: 'scale(' + interpolatingStyle.scale + ')',
                  verticalAlign: 'middle',
                };
                return(
                    <GridTile
                      style={{'cursor': 'pointer', 'borderRadius':10, width:tileWidth, marginTop:'1rem'}}
                      onTouchTap={ () => this.handlePostClick(post._id)}>
                      <Card
                        onMouseEnter={()=>{this.handleHover(i);}}
                        onMouseLeave={()=>{this.handleHover(false);}}>
                        <CardMedia
                          style={{'display':'inline-block',height:'10%', 'overflow':'hidden'}}>
                          <img height='100%' style={style} src={post.thumbnail? thumbnailPath + post.thumbnail : DEFAULT_IMAGE } onError={(e)=>e.target.src = DEFAULT_IMAGE} />
                        </CardMedia>
                        <CardTitle><span className={cx('postCardTitle')}>{post.title}</span></CardTitle>
                        <CardText className={cx('postCardFooter')} style={{fontSize:'0.8em'}}>
                          <div className={cx('flex0','postCardFooterLeft')}>
                            <Avatar backgroundColor={'#32FAE2'} size={12}>{post.author?post.author.substr(0,1).toUpperCase():''}</Avatar>{post.author}
                          </div>
                          <div className={cx('flex1','postCardFooterRight')}>
                            <MdDateRange/>
                            {moment(post.created).format('LL')}
                          </div>
                        </CardText>
                      </Card>
                    </GridTile>);
              }}
            </Motion>);
        })}
      </div>
    </div>
    );
  }
}

RelatedList.defaultProps = {
  type: '',
  posts: [],
  isMobile: false,
};
RelatedList.propTypes = {
  type: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isMobile: PropTypes.bool.isRequired,
};
export default RelatedList;
