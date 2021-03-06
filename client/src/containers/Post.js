import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Pagination from 'material-ui-pagination';
import classNames from 'classnames/bind';

import {Searchbar, PostList} from '../components';
import {addPost, listPost, updatePost, deletePost, countPost} from '../actions/post';
import {getCategory} from '../actions/category';
import {getStatusRequest} from '../actions/authentication';
import {toggleSearchModal} from '../actions/environment';

const cx = classNames.bind(styles);
const sc = classNames.bind(scss);
import styles from '../../../style/main.css';
import scss from '../../../style/NotFound.scss';


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
      isInit: true,
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
      this.props.listPost(this.props.params.category,this.state.number) // 1 means page number.
        .then(()=>{
          this.setState({
            isInit: false,
          });
        });
      this.props.countPost(this.props.params.category);
      this.props.getCategory(this.props.params.category)
        .then(()=>{
          if(!Object.keys(this.props.category).length){
            browserHistory.replace('/NotFound');
          }
        });
    }
    else{
      this.props.listPost(this.props.params.category,this.state.number)// 1 means page number.
        .then(()=>{
          this.setState({
            isInit: false,
          });
        });
      this.props.countPost(this.props.params.category);
    }
  }
  componentWillReceiveProps(nextProps) {
    //location.state has number of page.
    if((this.props.params.category !== nextProps.params.category) || (this.props.location.state != nextProps.location.state) ){
      window.scrollTo(0, 0);
      let number = 1;
      if(typeof nextProps.location.state != 'undefined'){
        if(this.props.location.state != nextProps.location.state);
        number = nextProps.location.state.number;
      }
      var category = nextProps.params.category;
      if(nextProps.params.category){

        this.props.listPost(category,number);// 1 means page number.
        this.props.countPost(category);
        this.props.getCategory(category)
          .then(()=>{
            if(!Object.keys(category).length){
              browserHistory.replace('/NotFound');
            }
          });
      }
      else{
        this.props.listPost(category,number);// 1 means page number.
        this.props.countPost(category);
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
    if(this.state.number == number){
      return ;
    }

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
    let category = this.props.params.category;
    if(category){
      browserHistory.push({pathname: `/category/${category}`, state: {number: 1}});
    }
    else{
      browserHistory.push({pathname: '/category', state: {number: 1}});
    }
  }
  render(){
    const {list, count} = this.props.post;
    const {number, display} = this.state;
    const {screenWidth} = this.props.environment;
    const isMobile = screenWidth < 1000;
    const category = this.props.params.category?this.props.params.category:'Recent Posts';
    const total = parseInt(((count.count)-1) / 10 + 1);
    const posts = list.posts;
    return(
        <div className={isMobile?styles.mobileListContainer:styles.listContainer}>
          <div>
            <div className={cx('headerContainer', 'listHeaderContainer')}>
              <span className={cx('headerLeft','category')} >
                <span className={styles.headerText} onClick={this.handleHeaderClick}>{category}</span>
              </span>
              {this.props.params.category?
                <div className={cx('headerRight','category')}>
                  <Searchbar
                    className={cx('headerText')}
                    category={category}
                    toggleSearchModal={this.props.toggleSearchModal}/>
                </div>:null}
            </div>
            <Divider style={{'marginTop':'1.5rem', 'marginBottom':'1.5rem'}} />
            {this.state.isInit?null:list.status == 'SUCCESS'&&posts.length>0 ?
              <PostList
                handlePostClick={this.handlePostClick}
                isMobile={isMobile}
                screenWidth={this.props.environment.screenWidth}
                screenHeight={this.props.environment.screenHeight}
                posts={posts}/>:
                (list.status == 'SUCCESS' || list.status == 'FAILURE')&&posts.length <= 0?
                <div className={sc('notFoundContainer')}>
                  <h1 className={sc('header', 'bigHeader')}>SORRY...</h1>
                  <h1 className={sc('header', 'mainHeader')}>NOTHING FOUND</h1>
                  <ul className={sc('list')}>
                    <li>
                      <a className={sc('header', 'subHeader')} onClick={()=>browserHistory.push('/')}>
                        main
                      </a>
                    </li>
                  </ul>
                </div>:null}
            {this.state.isInit?null:count.status == 'SUCCESS'&&count.count>0 ?
              <div style={{'textAlign':'center'}}>
                <Pagination
                  total = { total }
                  current = { number }
                  display = { display }
                  onChange = { number => this.handlePagination(number) }
                />
              </div>:null}
            {this.props.status.valid?
              <RaisedButton label="새글 추가" fullWidth={true} onTouchTap={this.handleEditPost} />:null}
          </div>
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
  toggleSearchModal : () => {console.log('Post props Error');},
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
  getCategory: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
  getStatusRequest: PropTypes.func.isRequired,
  toggleSearchModal: PropTypes.func.isRequired,
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
    getCategory: (categoryName) => {
      return dispatch(getCategory(categoryName));
    },
    getStatusRequest: (token) => {
      return dispatch(getStatusRequest(token));
    },
    toggleSearchModal: (isOpen, category) => {
      return dispatch(toggleSearchModal(isOpen, category));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
