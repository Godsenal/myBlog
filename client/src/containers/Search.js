import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classNames/bind';

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FaArchive from 'react-icons/fa/archive';
import FaFrownO from 'react-icons/fa/frown-o';
import CircularProgress from 'material-ui/CircularProgress';
import Pagination from 'material-ui-pagination';


import {Searchbar, PostList} from '../components';
import {searchPost, searchCountPost} from '../actions/post';
import {getStatusRequest} from '../actions/authentication';

const cx = classNames.bind(styles);
import styles from '../../../style/main.css';


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
    window.scrollTo(0, 0);
    if((this.props.params !== nextProps.params) ||(this.props.location.state != nextProps.location.state)){

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
  handleHeaderClick = (category) => {
    if(category){
      browserHistory.push(`/category/${category}`);
    }
  }
  render(){
    const {search, searchCount} = this.props.post;
    const {number, display} = this.state;
    const {type, word} = this.props.params;
    const {screenWidth} = this.props.environment;
    const isMobile = screenWidth < 1000;
    const category = this.props.params.category?this.props.params.category:'';

    const header =
      <span style={{lineHeight:'200%'}}>
        {category?
          <span>
            <span style={{'cursor':'pointer', color: '#FFB03B' }} onClick={() => this.handleHeaderClick(category)}> {category}  </span>
            <span >내</span>
            <br/>
          </span>
          :null}
        <span style={{'color':'#EFECCA'}}> '{word}' </span>에 대한 검색결과
      </span>;
    const total = parseInt(((searchCount.count)-1) / 10 + 1);
    const posts = search.results;
    return(
        <div className={styles.listContainer}>
          {search.status === 'SUCCESS'?
          <div>
            <div className={cx('headerContainer', 'listHeaderContainer')}>
              <span className={cx('headerLeft','category','searchHeader')}>
                <FaArchive/>&nbsp;{header}
              </span>
              <div className={cx('headerRight','category')}>
                <Searchbar className={cx('headerText')} category={category}/>
              </div>
            </div>
            <Divider style={{'marginTop':'1.5rem', 'marginBottom':'1.5rem'}} />
            {posts.length>0?
              <PostList
                isMobile={isMobile}
                screenWidth={screenWidth}
                posts={posts}/>:
                <div style={{'textAlign':'center','fontSize':'3vw'}}>
                  <FaFrownO style={{'fontSize':'10vw','margin':'2rem'}}/>
                  <h2 >No Result for '{<span style={{'color':'#329FFF'}}>{word}</span>}'.</h2>
                  <div style={{'margin':'2rem'}}>
                    <Searchbar category={category}/>
                  </div>
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

Search.defaultProps ={
  params: {},
  location: {},
  environment: {},
  post: {},
  category: {},
  status: {},
  setPostHistory : () => {console.log('Post props Error');},
  getStatusRequest : () => {console.log('Post props Error');},
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
