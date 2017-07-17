import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import FlatButton from 'material-ui/FlatButton';


import AppBar from 'material-ui/AppBar';

import { Sidebar } from '../components';
import { initEnvironment} from '../actions/environment';
import { getStatusRequest} from '../actions/authentication';
import styles from '../../../style/main.css';
import Bluebird from 'bluebird';


// Node
global.Promise = Bluebird;
// Browser
window.Promise = Bluebird;
//Mui Setting
injectTapEventPlugin();

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
      <MuiThemeProvider>
        <div className={styles.appContainer} style={{'overflowX':'hidden', 'overflowY':'hidden', 'margin': 0, 'padding': 0}}>
          <div className={styles.mainContainer}>
            {isMobile?
            <AppBar
              className={styles.header}
              title="LTH's Blog"
              style={{'backgroundColor':'#ECF0F1'}}
              titleStyle={{'color':'#2C3E50'}}
              onTouchTap={this.handleHeaderClick}
              showMenuIconButton={false}
              iconElementRight={<FlatButton style={{'color':'#2C3E50'}} label="메뉴" onTouchTap={()=>this.toggleSidebar()}/>}
            />:null}
            {this.props.children && React.cloneElement(this.props.children, {
              isMobile
            })}
          </div>
          <div className={sidebarStyle}>
            <Sidebar isMobile={isMobile} open={open} toggleSidebar={this.toggleSidebar}/>
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
