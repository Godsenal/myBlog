import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FaArchive from 'react-icons/fa/archive';
import FaFrownO from 'react-icons/fa/frown-o';
import CircularProgress from 'material-ui/CircularProgress';
import Pagination from 'material-ui-pagination';

import {Searchbar, PostList} from '../components';
import {addPost, listPost, updatePost, deletePost, countPost, searchPost, searchCountPost, setPostHistory} from '../actions/post';
import {getCategory} from '../actions/category';
import {getStatusRequest} from '../actions/authentication';

import styles from '../../../style/main.css';


class Post extends Component{
  constructor(props){
    super(props);
    this.setTotal = this.setTotal.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
    this.handlePagination = this.handlePagination.bind(this);

    let number = 1;
    //뒤로가기 눌렀을 때
    if((this.props.location.action == 'POP') && (typeof this.props.location.state != 'undefined')){
      number = this.props.location.state.number;
    }
    this.state = {
      display: 7,
      number,
      isReset: false,
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
  componentDidMount(){
    window.scrollTo(0, 0);
    if(this.props.params.category){
      this.props.getCategory(this.props.params.category)
        .then(()=>{
          if(Object.keys(this.props.category).length){
            this.props.listPost(this.props.params.category,this.state.number);// 1 means page number.
            this.props.countPost(this.props.params.category);
          }
          else{
            browserHistory.push('/NotFound');
          }
        });
    }
    else{
      this.props.listPost(this.props.params.category,this.state.number);// 1 means page number.
      this.props.countPost(this.props.params.category);
    }
  }
  componentWillReceiveProps(nextProps) {
    window.scrollTo(0, 0);
    if((this.props.params.category !== nextProps.params.category) || (this.props.location.state != nextProps.location.state) ){
      let number = 1;
      if(typeof nextProps.location.state != 'undefined'){
        if(this.props.location.state != nextProps.location.state);
        number = nextProps.location.state.number;
      }
      if(nextProps.params.category){
        this.props.getCategory(nextProps.params.category)
          .then(()=>{
            if(Object.keys(this.props.category).length){
              this.props.listPost(this.props.params.category,number);// 1 means page number.
              this.props.countPost(this.props.params.category);
            }
            else{
              browserHistory.push('/NotFound');
            }
          });
      }
      else{
        this.props.listPost(nextProps.params.category,number);// 1 means page number.
        this.props.countPost(nextProps.params.category);
      }

      this.setState({
        number: number,
        isReset: false,
      });
    }
  }
  handleEditPost = () => {
    var token = localStorage.getItem('token');
    this.props.getStatusRequest(token)
      .then(()=>{
        if(this.props.status.valid){
          browserHistory.push(`/post/new/${this.props.params.category}`);
        }
      });
  }
  renderProgress = () =>{
    return(
    <div className={styles.centerContainer}>
      <h1>페이지를 찾는 중입니다...</h1>
      <CircularProgress size={100} thickness={7} />
    </div>);
  }
  handlePagination = (number) => {
    this.setState({
      number
    });
    let category = this.props.params.category;
    if(!this.props.params.category){
      category = '';
    }
    browserHistory.push({pathname: `/category/${category}`, state: {number: number}});

  }
  handleHeaderClick = () => {
    if(this.props.params.category){
      this.props.listPost(this.props.params.category,1)
        .then(()=>{
          this.props.countPost(this.props.params.category);
          this.setState({
            word:'',
            isSearch: false,
            number: 1,
            isReset: false,
          });
        });
    }
  }
  handlePostClick = () => {
    let history = {
      number: this.state.number,
    };
    this.props.setPostHistory(history);
  }
  render(){
    const {list, count} = this.props.post;
    const {number, display} = this.state;
    const {screenWidth} = this.props.environment;
    const isMobile = screenWidth < 1000;
    const category = this.props.params.category?this.props.params.category:'최근 글';

    const total = parseInt(((count.count)-1) / 10 + 1);
    const posts = list.posts;
    return(
        <div className={styles.listContainer}>
          {list.status === 'SUCCESS'?
          <div>
            <div>
              <span style={{'textAlign':'left'}} className={styles.category}>
                <FaArchive/>&nbsp;{category}
              </span>
              {this.props.params.category?
                <div style={{'float':'right'}}>
                  <Searchbar category={category} handleSearchPost={this.handleSearchPost}/>
                </div>:null}
            </div>
            <Divider style={{'marginTop':'1.5rem', 'marginBottom':'1.5rem'}} />
            {posts.length>0?
              <PostList
                handlePostClick={this.handlePostClick}
                isMobile={isMobile}
                posts={posts}/>:
                <div style={{'textAlign':'center','fontSize':'3vw'}}>
                  <FaFrownO style={{'fontSize':'10vw'}}/>
                  <h1 >결과가 없습니다.</h1>
                </div>}
            <div style={{'textAlign':'center'}}>
              <Pagination
                total = { total }
                current = { number }
                display = { display }
                onChange = { number => this.handlePagination(number) }
              />
            </div>
            {this.props.status.valid?
              <RaisedButton label="새글 추가" fullWidth={true} onTouchTap={this.handleEditPost} />:null}
          </div>:null}
        </div>

    );
  }
}

Post.defaultProps ={
  params: {},
  location: {},
  environment: {},
  post: {},
  category: {},
  status: {},
  addPost : () => {console.log('Post props Error');},
  listPost : () => {console.log('Post props Error');},
  updatePost : () => {console.log('Post props Error');},
  deletePost : () => {console.log('Post props Error');},
  countPost : () => {console.log('Post props Error');},
  setPostHistory : () => {console.log('Post props Error');},
  getCategory : () => {console.log('Post props Error');},
  getStatusRequest : () => {console.log('Post props Error');},
};
Post.propTypes = {
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  environment : PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired,
  listPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  countPost: PropTypes.func.isRequired,
  setPostHistory: PropTypes.func.isRequired,
  getCategory: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
  getStatusRequest: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    post: state.post,
    category: state.category.get.category,
    environment: state.environment,
    status: state.authentication.status,
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
    setPostHistory: (history) => {
      return dispatch(setPostHistory(history));
    },
    getCategory: (categoryName) => {
      return dispatch(getCategory(categoryName));
    },
    getStatusRequest: (token) => {
      return dispatch(getStatusRequest(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
