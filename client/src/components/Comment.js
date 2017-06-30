import React, { Component } from 'react';
import ReactDisqusComments from 'react-disqus-comments';
import PropTypes from 'prop-types';

class Comment extends Component {
  render () {
    return(
      <ReactDisqusComments
          shortname="godsenal"
          identifier={this.props.postID}
          url='https://www.godsenal.com'/>
    );
  }
}

Comment.propTypes= {
  postID: PropTypes.string.isRequired,
};
export default Comment;
