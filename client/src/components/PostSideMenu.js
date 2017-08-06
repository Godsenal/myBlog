import React from 'react';
import PropTypes from 'prop-types';
import {Motion, spring} from 'react-motion';
import {Link} from 'react-scroll';

import styles from '../../../style/main.css';

import FaCommentO from 'react-icons/lib/fa/comment-o';
import FaAngleUp from 'react-icons/lib/fa/angle-up';
import FaAngleDown from 'react-icons/lib/fa/angle-down';
import FaListAlt from 'react-icons/lib/fa/list-alt';

const PostSideMenu = (props) =>{

  const getSideMenuDefaultStyle = () => {
    return {
      defaultStyle: {
        translateY: 0,
      },
      style:{
        translateY: spring(props.isCommentVisible? 30 : 0),
      },
    };
  };

  const {scrollToTop, handleListClick, scrollToBottom} = props;

  return(
    <Motion {...getSideMenuDefaultStyle()}>
      {interpolatedStyle =>{
        let style={
          transform: 'translateY(-'+interpolatedStyle.translateY+'%)',
        };
        return (<div className={styles.fixedSideMenu} style={style}>
      <span style={{fontSize:'0.5em'}}>MOVE</span><br/>
      <p className={styles.fixedSideMenuItem}><FaAngleUp onClick={scrollToTop}/></p>
      <p className={styles.fixedSideMenuItem}><FaListAlt onClick={handleListClick}/></p>
      <Link to='disqusContainer' spy={true} smooth={true} duration={500}>
        <FaCommentO className={styles.fixedSideMenuItem}/>
      </Link>
      <p className={styles.fixedSideMenuItem}><FaAngleDown onClick={scrollToBottom}/></p>
    </div>);
      }
      }
    </Motion>
  );
};

PostSideMenu.defaultProps = {
  isCommentVisible: true,
  scrollToTop: ()=>{console.log('PostSideMenu Props Error');},
  scrollToBottom: ()=>{console.log('PostSideMenu Props Error');},
  handleListClick: ()=>{console.log('PostSideMenu Props Error');}
};
PostSideMenu.propTypes = {
  isCommentVisible: PropTypes.bool.isRequired,
  scrollToTop: PropTypes.func.isRequired,
  scrollToBottom: PropTypes.func.isRequired,
  handleListClick: PropTypes.func.isRequired,
};
export default PostSideMenu;
