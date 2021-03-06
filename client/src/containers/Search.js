import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Pagination from 'material-ui-pagination';


import {PostList, SearchInput} from '../components';
import {searchPost, searchCountPost} from '../actions/post';
import {getStatusRequest} from '../actions/authentication';
import {toggleSearchModal} from '../actions/environment';

import styles from '../../../style/main.css';
import scss from '../../../style/NotFound.scss';

const cx = classNames.bind(styles);
const sc = classNames.bind(scss);

class Search extends Component{
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
      number: number,
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
    const {word, type, category} = this.props.params;
    this.props.searchPost(word, this.state.number, type, category)
      .then(()=>{
        this.props.searchCountPost(word, type, category);
      });
  }
  componentWillReceiveProps(nextProps) {

    if((this.props.params !== nextProps.params) ||(this.props.location.state != nextProps.location.state)){
      window.scrollTo(0, 0);
      const {word, type, category} = nextProps.params;

      let number = 1;
      if(typeof nextProps.location.state != 'undefined'){
        if(this.props.location.state != nextProps.location.state);
        number = nextProps.location.state.number;
      }

      this.props.searchPost(word, number, type, category)
        .then(()=>{
          this.props.searchCountPost(word, type, category);
        });

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
    const {word, type, category} = this.props.params;
    let path = `/search/${type}/${word}`;
    if(typeof category != 'undefined'){
      path += `/${category}`;
    }
    browserHistory.push({pathname: path, state: {number: number}});

  }
  handleHeaderClick = () => {
    let {category} = this.props.params;
    if(category){
      browserHistory.push(`/category/${category}`);
    }
    else{
      browserHistory.push('/');
    }
  }
  render(){
    const {search, searchCount} = this.props.post;
    const {number, display} = this.state;
    const {type, word} = this.props.params;
    const {screenWidth} = this.props.environment;
    const isMobile = screenWidth < 1000;
    const category = this.props.params.category?this.props.params.category:'ALL';

    const total = parseInt(((searchCount.count)-1) / 10 + 1);
    const posts = search.results;
    return(
        <div className={isMobile?styles.mobileListContainer:styles.listContainer}>
          {search.status === 'SUCCESS'?
          <div>
            <div className={cx('headerContainer', 'listHeaderContainer')}>
              <span className={cx('headerLeft','category')} >
                <span className={styles.headerText} onClick={this.handleHeaderClick}>{category}</span>
              </span>
            </div>
            <SearchInput
              category={this.props.params.category}
              type={type}
              word={word}
              toggleSearchModal={this.props.toggleSearchModal} />
            <Divider style={{'marginTop':'1.5rem', 'marginBottom':'1.5rem'}} />
            {this.state.isInit?null:search.status == 'SUCCESS'&&posts.length>0?
              <PostList
                isMobile={isMobile}
                screenWidth={screenWidth}
                posts={posts}/>:
                <div className={sc('notFoundContainer')}>
                  <h1 className={sc('header', 'bigHeader')}>SORRY...</h1>
                  <h1 className={sc('header', 'mainHeader')}>No Result for '{<span className={sc('header', 'subSpan')}>{word}</span>}'.</h1>
                </div>}
            {this.state.isInit?null:searchCount.status == 'SUCCESS'&&searchCount.count>0 ?
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
          </div>:null}
        </div>

    );
  }
}

Search.defaultProps ={
  params: {},
  location: {},
  environment: {},
  post: {},
  category: {},
  status: {},
  setPostHistory : () => {console.log('Post props Error');},
  getStatusRequest : () => {console.log('Post props Error');},
  toggleSearchModal : () => {console.log('Post props Error');},
};
Search.propTypes = {
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  environment : PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  searchPost: PropTypes.func.isRequired,
  searchCountPost: PropTypes.func.isRequired,
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
    searchPost: (word, number, type, category ) => {
      return dispatch(searchPost(word, number, type, category ));
    },
    searchCountPost: (word, type, category) => {
      return dispatch(searchCountPost(word, type, category));
    },
    getStatusRequest: (token) => {
      return dispatch(getStatusRequest(token));
    },
    toggleSearchModal: (isOpen,category) => {
      return dispatch(toggleSearchModal(isOpen,category));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
