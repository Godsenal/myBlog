import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AppBar from 'material-ui/AppBar';

import { Sidebar } from '../components';
import { initEnvironment} from '../actions/environment';

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
    const sideWidth = 200;
    const mainWidth = screenWidth - sideWidth;
    return(
      <MuiThemeProvider>
        <div style={{'height':{screenHeight}+'px', 'width':{screenWidth}+'px', 'overflowX':'hidden', 'overflowY':'hidden'}}>
          <div style={{'width':'85%'}}>
            <AppBar
              title="Title"
              iconClassNameRight="muidocs-icon-navigation-expand-more"
            />
            {this.props.children}
          </div>
          <Sidebar/>
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
