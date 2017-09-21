import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import classNames from 'classnames/bind';

import scss from '../../../style/Search.scss';

const sc = classNames.bind(scss);

const searchMenu = [
  {value: 'title', text: '제목'},
  {value: 'text', text: '내용'},
  {value: 'all', text: '제목+내용'},
  {value: 'tags', text: '태그'},
];
class SearchModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      word: '',
      activeIndex: 0,
    };
  }
  
  handleClick = (e) => {
    if(e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'SPAN'){
      this.setState({
        activeIndex: 0,
        word: ''
      });
      this.props.toggleSearchModal(false);
    }
  }

  handleCategorySelect = (i) => {
    this.setState({
      activeIndex: i,
    });
  }
  handleOpen = () => {
    this.props.toggleSearchModal(true);
  };
  handleClose = () => {
    this.props.toggleSearchModal(false);
  }
  handleWordChange = (e) => {
    this.setState({
      word : e.target.value,
    });
  }
  handleTypeChange = (e, index, value) => {
    this.setState({
      type : value
    });
  }
  handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      browserHistory.push(`/search/${searchMenu[this.state.activeIndex].value}/${this.state.word}/${this.props.category}`);
      this.handleClose();
    }
  }
  render(){
    const {word} = this.state;
    return(
        <div className='container' onClick={this.handleClick}>
          <div className='innerContainer'>
            <h1 className='searchHeader'>SEARCH</h1>
            <div className={sc('spaceBetween','categoryContainer')}>
              {searchMenu.map((el, i) => {
                return <span
                          className={sc('flex-1-0',this.state.activeIndex===i?'selectedCategory':'category')}
                          onClick={()=>this.handleCategorySelect(i)}>{el.text}</span>;
              })}
            </div>
              <input
                autoFocus={true}
                placeholder='Search Anything...'
                className='input'
                type='search'
                value={word}
                onChange={this.handleWordChange}
                onKeyPress={this.handleKeyPress}/>
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
