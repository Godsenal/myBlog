import React from 'react';
import PropTypes from 'prop-types';
import FaSearch from 'react-icons/fa/search';



const inlineStyles = {
  iconStyle: {
    cursor: 'pointer'
  },
};
const Searchbar = (props) => {
  const {toggleSearchModal, category} = props;
  
  const handleOpen = () => {
    toggleSearchModal(true,category);
  };

  return(
    <div>
      <FaSearch onClick={handleOpen} style={inlineStyles.iconStyle}/>
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
