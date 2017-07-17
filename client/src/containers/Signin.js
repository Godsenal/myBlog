import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import {signinRequest} from '../actions/authentication';
import styles from '../../../style/main.css';

class Signin extends Component {
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      snackMessage: '',
      snackOpen: false,
    };
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]:e.target.value
    });
  }
  handleSignin = () => {
    const {email, password} = this.state;
    if(!email){
      this.handleSnackOpen('이메일을 입력해 주세요.');
    }
    else if(!password){
      this.handleSnackOpen('비밀번호를 입력해 주세요.');
    }
    else{
      this.props.signinRequest(email,password)
        .then(()=>{
          if(this.props.signin.status === 'SUCCESS'){
            this.handleSnackOpen('성공적으로 로그인 되었습니다.');
            browserHistory.push('/');

          }
          else{
            this.handleSnackOpen('아이디 혹은 비밀번호가 잘못되었습니다.');
          }
        });
    }
  }
  handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      this.handleSignin();
    }
  }
  handleSnackOpen = (message) => {
    this.setState({
      snackOpen: true,
      snackMessage: message,
      email: '',
      password: '',
    });
  }
  handleSnackClose = () => {
    this.setState({
      snackOpen: false,
    });
  }
  render(){
    const {email, password} = this.state;
    return(
      <div className={styles.centering}>
        <h3>Sign in</h3>
        <TextField
          floatingLabelText="email"
          id='email'
          value={email}
          onChange={this.handleChange}
        />
        <br/>
        <TextField
          floatingLabelText="password"
          id='password'
          type="password"
          value={password}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <br/>
        <RaisedButton
          label="로그인"
          primary={true}
          onTouchTap={this.handleSignin}
        />
        <Snackbar
          open={this.state.snackOpen}
          message={this.state.snackMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackClose}
        />
      </div>
    );
  }
}

Signin.defaultProps ={
  signin: {},
  status: {},
  signinRequest : () => {console.log('Signin props Error');},
};
Signin.propTypes = {
  signin: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  signinRequest: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    signin: state.authentication.signin,
    status: state.authentication.status,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    signinRequest : (email, password) => {
      return dispatch(signinRequest(email,password));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
