import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import Pagination from 'material-ui-pagination';


import {PostList,} from '../components';
import {datePost, dateCountPost} from '../actions/post';

import styles from '../../../style/main.css';
import scss from '../../../style/NotFound.scss';

const cx = classNames.bind(styles);
const sc = classNames.bind(scss);

class DatePost extends Component{
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
    const {year, month} = this.props.params;

    if(!parseInt(year)||!parseInt(month)){
      browserHistory.replace('/NotFound');
    }
    else{
      window.scrollTo(0, 0);

      this.props.datePost(year, month, this.state.number)
        .then(()=>{
          this.props.dateCountPost(year, month);
          this.setState({
            isInit: false,
          });
        });
    }

  }
  componentWillReceiveProps(nextProps) {

    if((this.props.params !== nextProps.params) ||(this.props.location.state != nextProps.location.state)){
      window.scrollTo(0, 0);
      const {year, month} = nextProps.params;

      let number = 1;
      if(typeof nextProps.location.state != 'undefined'){
        if(this.props.location.state != nextProps.location.state);
        number = nextProps.location.state.number;
      }

      this.props.datePost(year, month, number)
        .then(()=>{
          this.props.dateCountPost(year, month);
        });

      this.setState({
        number: number,
      });
    }
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
    const {year, month} = this.props.params;
    let path = `/date/${year}/${month}`;
    browserHistory.push({pathname: path, state: {number: number}});

  }
  handleHeaderClick = () => {
    let {year, month} = this.props.params;
    browserHistory.push(`/date/${year}/${month}`);
  }
  render(){
    const {list, count} = this.props.post;
    const {number, display} = this.state;
    const {screenWidth} = this.props.environment;
    const {year, month} = this.props.params;
    const isMobile = screenWidth < 1000;

    const total = parseInt(((count.count)-1) / 10 + 1);
    const posts = list.posts;
    return(
        <div className={isMobile?styles.mobileListContainer:styles.listContainer}>
          {list.status === 'SUCCESS'?
          <div>
            <div className={cx('headerContainer', 'listHeaderContainer')}>
              <span className={cx('headerLeft','category')} >
                <span className={styles.headerText} onClick={this.handleHeaderClick}>DATE : {year}.{month}</span>
              </span>
            </div>
            <Divider style={{'marginTop':'1.5rem', 'marginBottom':'1.5rem'}} />
            {this.state.isInit?null:list.status == 'SUCCESS'&&posts.length>0?
              <PostList
                isMobile={isMobile}
                screenWidth={screenWidth}
                posts={posts}/>:
                <div className={sc('notFoundContainer')}>
                  <h1 className={sc('header', 'bigHeader')}>SORRY...</h1>
                  <h1 className={sc('header', 'mainHeader')}>No Result for '{<span className={sc('header', 'subSpan')}>{year}.{month}</span>}'.</h1>
                </div>}
            {this.state.isInit?null:count.status == 'SUCCESS'&&count.count>0 ?
              <div style={{'textAlign':'center'}}>
                <Pagination
                  total = { total }
                  current = { number }
                  display = { display }
                  onChange = { number => this.handlePagination(number) }
                />
              </div>:null}
            </div>:null}
      </div>

    );
  }
}

DatePost.defaultProps ={
  params: {},
  location: {},
  environment: {},
  post: {},
  datePost : () => {console.log('Post props Error');},
  dateCountPost : () => {console.log('Post props Error');},
};
DatePost.propTypes = {
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  environment : PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  datePost: PropTypes.func.isRequired,
  dateCountPost: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    post: state.post,
    environment: state.environment,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    datePost: (year, month, number ) => {
      return dispatch(datePost(year, month, number));
    },
    dateCountPost: (year, month) => {
      return dispatch(dateCountPost(year, month));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DatePost);
