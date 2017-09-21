import React from 'react';
import PropTypes from 'prop-types';
import FaSearch from 'react-icons/fa/search';
import styles from '../../../style/main.css';



const Searchbar = (props) => {
  const {toggleSearchModal, category} = props;

  const handleOpen = () => {
    toggleSearchModal(true,category);
  };

  return(
    <div className={styles.searchContainer} onClick={handleOpen}>
      <FaSearch/>
    </div>
  );
};
Searchbar.defaultProps = {
  category: '',
  toggleSearchModal: ()=> {console.log('SearchModal props Error');}
};
Searchbar.propTypes = {
  category: PropTypes.string.isRequired,
  toggleSearchModal: PropTypes.func.isRequired,
};
export default Searchbar;
