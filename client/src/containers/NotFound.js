import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import classNames from 'classnames/bind';

import styles from '../../../style/NotFound.scss';
const cx = classNames.bind(styles);

class NotFound extends Component {
  handleMainClick = () => {
    browserHistory.push('/');
  }
  render () {
    return(
      <div className={cx('errorContainer')}>
        <h1 className={cx('header', 'errorHeader')} data-text='404'>404</h1>
        <h1 className={cx('header', 'mainHeader')}>SORRY</h1>
        <h1 className={cx('header', 'mainHeader')}>PAGE NOT FOUND.</h1>
        <ul className={cx('list')}>
          <li><a className={cx('header', 'subHeader')} onClick={this.handleMainClick}>main</a></li>
        </ul>
      </div>
    );
  }
}

export default NotFound;
