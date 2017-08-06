import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import {Link} from 'react-scroll';

import styles from '../../../style/main.css';

import FaCommentO from 'react-icons/lib/fa/comment-o';
import FaAngleUp from 'react-icons/lib/fa/angle-up';
import FaAngleDown from 'react-icons/lib/fa/angle-down';
import FaListAlt from 'react-icons/lib/fa/list-alt';

const cx = classNames.bind(styles);

const PostFixedFooter = (props) => {

  const {scrollToTop, handleListClick, scrollToBottom} = props;

  return(
    <div className={styles.fixedFooter}>
      <span className={cx('fixedFooterMenuItemLeft','flex0')}>
        <Link to='disqusContainer' spy={true} smooth={true} duration={500}>
          <FaCommentO className={styles.fixedSideMenuItem}/>
        </Link>
      </span>
      <span className={cx('fixedFooterMenuItemRight','flex1','textRight')} >
        <FaAngleDown className={cx('fixedSideMenuItem','fixedFooterMenuItemRight')} onClick={scrollToBottom}/>
        <FaAngleUp className={cx('fixedSideMenuItem','fixedFooterMenuItemRight')} onClick={scrollToTop}/>
        <FaListAlt className={cx('fixedSideMenuItem','fixedFooterMenuItemRight')} onClick={handleListClick}/>
      </span>
    </div>
  );
};

PostFixedFooter.defaultProps = {
  scrollToTop: ()=>{console.log('PostSideMenu Props Error');},
  scrollToBottom: ()=>{console.log('PostSideMenu Props Error');},
  handleListClick: ()=>{console.log('PostSideMenu Props Error');}
};
PostFixedFooter.propTypes = {
  scrollToTop: PropTypes.func.isRequired,
  scrollToBottom: PropTypes.func.isRequired,
  handleListClick: PropTypes.func.isRequired,
};
export default PostFixedFooter;
