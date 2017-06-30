import React, {Component} from 'react'
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import MdError from 'react-icons/md/error';

class NotFound extends Component {
  render () {
    return(

        <div style={{'padding': 30,'textAlign': 'center'}}>
          <Paper zDepth={2} style={{'padding': 30,'textAlign': 'center','height':'100%'}}>
            <h1><MdError/> 페이지를 찾을 수 없습니다.</h1>
            <Divider style={{'marginTop':'3rem','marginBottom':'3rem'}}/>
          </Paper>
        </div>
    );
  }
}

export default NotFound;
