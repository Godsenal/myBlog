import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {SearchInput} from './';

class SearchModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      word: '',
      type: '',
      activeIndex: 0,
    };
  }

  handleClick = (e) => {
    if(e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'SPAN'){
      this.setState({
        activeIndex: 0,
        word: '',
        type: '',
      });
      this.props.toggleSearchModal(false);
    }
  }

  render(){
    const {word,type} = this.state;
    return(
        <div className='container' onClick={this.handleClick}>
          <div className='innerContainer'>
            <h1 className='searchHeader'>SEARCH</h1>
            <SearchInput
              category={this.props.category}
              type={type}
              word={word}
              toggleSearchModal={this.props.toggleSearchModal} />
          </div>
        </div>
    );
  }
}
SearchModal.defaultProps = {
  category: '',
  toggleSearchModal: ()=> {console.log('SearchModal props Error');}

};
SearchModal.propTypes = {
  category: PropTypes.string.isRequired,
  toggleSearchModal: PropTypes.func.isRequired,

};
export default SearchModal;
