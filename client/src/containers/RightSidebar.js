import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import FaSearch from 'react-icons/lib/fa/search';

import {MiniSearch, PostDate} from '../components';
import styles from '../../../style/RightSidebar.scss';

const cx = classNames.bind(styles);
export class RightSidebar extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className={cx('right-sidebar')}>
        <div className={cx('sidebar-main')}>
          <div className={cx('sidebar-search')}>
            <MiniSearch/>
          </div>
          <div className={cx('sidebar-item')}>
            <div className={cx('sidebar-item-header')}>
              <span>Archive By Date</span>
            </div>
            <div className={cx('sidebar-date')}>
              <PostDate />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(RightSidebar)
