import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Motion, spring} from 'react-motion';

import {Card, CardHeader, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import Divider from 'material-ui/Divider';
import Pagination from 'material-ui-pagination';
import MdRemoveRedEye from 'react-icons/md/remove-red-eye';
import MdDateRange from 'react-icons/md/date-range';
import MdComment from 'react-icons/md/comment';
import RaisedButton from 'material-ui/RaisedButton';
import FaArchive from 'react-icons/fa/archive';
import CircularProgress from 'material-ui/CircularProgress';


import { CommentCount } from '../disqus';
import {addPost, listPost, updatePost, deletePost, countPost} from '../actions/post';
import {getCategory} from '../actions/category';
import styles from '../../../style/main.css';

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

class Post extends Component{
  constructor(){
    super();
    this.setTotal = this.setTotal.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
    this.state = {
      display: 7,
      number: 1,
      isHover: false,
      isReset: false,
    };
  }
  componentDidMount(){
    window.scrollTo(0, 0);
    if(this.props.params.category){
      this.props.getCategory(this.props.params.category)
        .then(()=>{
          if(Object.keys(this.props.category).length){
            this.props.listPost(this.props.params.category,1);// 1 means page number.
            this.props.countPost(this.props.params.category);
          }
          else{
            browserHistory.push('/NotFound');
          }
        });
    }
    else{
      this.props.listPost(this.props.params.category,1);// 1 means page number.
      this.props.countPost(this.props.params.category);
    }
  }
  componentWillReceiveProps(nextProps) {
    window.scrollTo(0, 0);
    if(this.props.params.category !== nextProps.params.category){
      if(this.props.params.category){
        this.props.getCategory(this.props.params.category)
          .then(()=>{
            if(Object.keys(this.props.category).length){
              this.props.listPost(this.props.params.category,1);// 1 means page number.
              this.props.countPost(this.props.params.category);
            }
            else{
              browserHistory.push('/NotFound');
            }
          });
      }
      else{
        this.props.listPost(this.props.params.category,1);// 1 means page number.
        this.props.countPost(this.props.params.category);
      }
      this.setState({
        number: 1,
        isReset: false
      });

    }
  }
  handleHover = (active) => {
    this.setState({isHover: active});
  }
  getPostSpringProps = (index) => {
    return {
      defaultStyle: {
        scale: 1,
        marginTop: 300,
        zIndex: 1,
      },
      style:{
        scale: spring(this.state.isHover===index ? 1.2 : 1),
        marginTop: spring(0),
        zIndex: spring(this.state.isHover===index ? 2 : 1),
      },
    };
  }
  setTotal(event, total) {
    // eslint-disable-next-line no-param-reassign
    total = total.trim();
    if (total.match(/^\d*$/)) {
      if (total !== '') {
        // eslint-disable-next-line no-param-reassign
        total = parseInt(total, 10);
      } else {
        // eslint-disable-next-line no-param-reassign
        total = 0;
      }
      this.setState({ total });
    }
  }
  setDisplay(event, display) {
    // eslint-disable-next-line no-param-reassign
    display = display.trim();
    if (display.match(/^\d*$/)) {
      if (display !== '') {
        // eslint-disable-next-line no-param-reassign
        display = parseInt(display, 10);
      } else {
        // eslint-disable-next-line no-param-reassign
        display = 0;
      }
      this.setState({ display });
    }
  }
  handlePagination(number){
    this.setState({
      number: number
    });
    this.props.listPost(this.props.params.category,number);
  }
  handlePostEdit = () => {
    browserHistory.push(`/post/new/${this.props.params.category}`);
  }
  renderProgress = () =>{
    return(
    <div className={styles.centerContainer}>
      <h1>페이지를 찾는 중입니다...</h1>
      <CircularProgress size={100} thickness={7} />
    </div>);
  }
  render(){
    const {list, count} = this.props.post;
    const {screenWidth} = this.props.environment;
    const isMobile = screenWidth < 1000;
    const category = this.props.params.category?this.props.params.category:'최근 글';
    const disqusShortname = 'godsenal';
    return(
        <div className={styles.listContainer}>
          {list.status === 'SUCCESS'?
          <div>
            <div>
              <span className={styles.category}><FaArchive/>&nbsp;{category}</span>
            </div>
            <Divider inset={true} style={{'margin':'3rem'}} />
            <GridList
              cols={isMobile?1:2}
              cellHeight={450}
              padding={10}
              style={inlineStyles.gridList}>
            {list.posts.map((post, i)=>{
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
            <div style={{'textAlign':'center'}}>
              <Pagination
                total = { parseInt((count.count-1) / 10 + 1) }
                current = { this.state.number }
                display = { this.state.display }
                onChange = { number => this.handlePagination(number) }
              />
            </div>
            <RaisedButton label="새글 추가" fullWidth={true} onTouchTap={this.handlePostEdit} />
          </div>:this.renderProgress()}
        </div>

    );
  }
}

Post.defaultProps ={
  params: {},
  environment: {},
  post: {},
  category: {},
  addPost : () => {console.log('Post props Error');},
  listPost : () => {console.log('Post props Error');},
  updatePost : () => {console.log('Post props Error');},
  deletePost : () => {console.log('Post props Error');},
  countPost : () => {console.log('Post props Error');},
  getCategory : () => {console.log('Post props Error');},
};
Post.propTypes = {
  params: PropTypes.object.isRequired,
  environment : PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired,
  listPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  countPost: PropTypes.func.isRequired,
  getCategory: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    post: state.post,
    category: state.category.get.category,
    environment: state.environment,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addPost: (post) => {
      return dispatch(addPost(post));
    },
    listPost: (category, number) => {
      return dispatch(listPost(category, number));
    },
    updatePost: (post) => {
      return dispatch(updatePost(post));
    },
    deletePost: (post) => {
      return dispatch(deletePost(post));
    },
    countPost: (category) => {
      return dispatch(countPost(category));
    },
    getCategory: (categoryName) => {
      return dispatch(getCategory(categoryName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
