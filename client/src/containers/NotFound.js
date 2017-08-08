import React, {Component} from 'react';
import MdError from 'react-icons/md/error';

import styles from '../../../style/main.css';
class NotFound extends Component {
  render () {
    return(
        <div className={styles.notFoundContainer}>
          <div style={{marginTop:'30%'}}>
            <MdError/>
            <div>Sorry</div>
            <div>Page can't be found...</div>
          </div>
        </div>
    );
  }
}

export default NotFound;
