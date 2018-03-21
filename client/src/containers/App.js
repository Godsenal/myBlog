import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AppBar from 'material-ui/AppBar';

import { Sidebar } from '../components';
import { initEnvironment} from '../actions/environment';
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
    };
  }


  componentDidMount() {
    /* INIT ENVIRONMENT */
    this.handleWindowSizeChange();
    window.onpopstate = this.onBackButtonEvent;
    window.addEventListener('resize', this.handleWindowSizeChange);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.props.initEnvironment();
  };

  render(){
    const {screenHeight, screenWidth} = this.props.environment;
    return(
      <MuiThemeProvider>
        <div className={styles.appContainer} style={{'overflowX':'hidden', 'overflowY':'hidden', 'margin': 0, 'padding': 0}}>
          <div className={styles.mainContainer}>
            <AppBar
              title="Title"
              showMenuIconButton={false}
            />
            {this.props.children}
          </div>
          <div className={styles.sidebarContainer}>
            <Sidebar />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

}

App.defaultProps ={
  initEnvironment : () => {console.log('App props Error');},
  environment : {},
};
App.propTypes = {
  environment : PropTypes.object.isRequired,
  initEnvironment : PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    environment: state.environment,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initEnvironment: () => {
      return dispatch(initEnvironment());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
