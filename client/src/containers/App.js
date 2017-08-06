import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import classNames from 'classnames/bind';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MdMenu from 'react-icons/lib/md/menu';
import Headroom from 'react-headroom';

import { Sidebar } from '../components';
import { initEnvironment} from '../actions/environment';
import { getStatusRequest} from '../actions/authentication';
import styles from '../../../style/main.css';
import Bluebird from 'bluebird';

const cx = classNames.bind(styles);

const muiTheme = getMuiTheme({
  svgIcon: {
    color: '#ECF0F1',
  },
});

// Node
global.Promise = Bluebird;
// Browser
window.Promise = Bluebird;
//Mui Setting
injectTapEventPlugin();

const inlineStyles = {
  headroom:{
    zIndex: '999',
    backgroundColor: '#333745',
    padding: 10,
  }
};
const title = "LTH's Blog";
class App extends Component{
  constructor(props){
    super(props);
    this.state={
      open: false,
    };

  }


  componentDidMount() {
    /* INIT ENVIRONMENT */
    this.handleWindowSizeChange();
    window.onpopstate = this.onBackButtonEvent;
    window.addEventListener('resize', this.handleWindowSizeChange);
    var token = localStorage.getItem('token');
    this.props.getStatusRequest(token);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.props.initEnvironment();
  };

  toggleSidebar = () => {
    this.setState({
      open: !this.state.open
    });
  }
  handleHeaderClick = () => {
    browserHistory.push('/');
  }
  render(){
    const {screenHeight, screenWidth} = this.props.environment;
    const {open} = this.state;
    const isMobile = screenWidth<1000;
    const sidebarStyle = !isMobile ? styles.sidebarContainer : null;
    return(
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={styles.appContainer} style={{'overflowX':'hidden', 'overflowY':'hidden', 'margin': 0, 'padding': 0}}>
          <div className={styles.mainContainer}>
            {isMobile?
              <Headroom style={inlineStyles.headroom}>
                <div className={cx('headerContainer')}>
                  <div className={cx('header','headerLeft')} ><span className={cx('headerText')} onClick={this.handleHeaderClick}>{title}</span></div>
                  <div className={cx('header','headerRight')}><span className={cx('headerText')} onClick={this.toggleSidebar}><MdMenu /></span></div>
                </div>
                {/*
                <AppBar
                  className={styles.header}
                  title="LTH's Blog"
                  titleStyle={{'color':'#FFFFFF'}}
                  onTitleTouchTap={this.handleHeaderClick}
                  showMenuIconButton={false}
                  iconElementRight={<FlatButton className={styles.button} style={{'color':'#2C3E50'}} label="메뉴" onTouchTap={()=>this.toggleSidebar()}/>}
                />*/}
              </Headroom>:null
            }
            {this.props.children && React.cloneElement(this.props.children, {
              isMobile
            })}
          </div>
          <div className={sidebarStyle}>
            <Sidebar isMobile={isMobile} open={open} toggleSidebar={this.toggleSidebar} title={title}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

}

App.defaultProps ={
  initEnvironment : () => {console.log('App props Error');},
  getStatusRequest : () => {console.log('App props Error');},
  environment : {},
  status: {},
};
App.propTypes = {
  environment : PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  initEnvironment : PropTypes.func.isRequired,
  getStatusRequest: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    environment: state.environment,
    status: state.authentication.status,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initEnvironment: () => {
      return dispatch(initEnvironment());
    },
    getStatusRequest: (token) => {
      return dispatch(getStatusRequest(token));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
