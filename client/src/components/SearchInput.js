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
class SearchInput extends Component{
  constructor(props){
    super(props);
    var activeIndex = 0;

    if(props.type){
      for(var i = 0; i<searchMenu.length; i++){
        if(searchMenu[i].value == props.type){
          activeIndex = i;
        }
      }
    }
    this.state = {
      word: props.word,
      activeIndex: activeIndex,
    };
  }

  handleCategorySelect = (i) => {
    this.setState({
      activeIndex: i,
    });
  }
  handleWordChange = (e) => {
    this.setState({
      word : e.target.value,
    });
  }
  handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      const {word,activeIndex} = this.state;
      let type = searchMenu[activeIndex].value;
      if(!this.state.word && this.state.word.trim()){
        return ;
      }
      browserHistory.push(`/search/${type}/${word.trim()}/${this.props.category}`);
      this.props.toggleSearchModal(false);
    }
  }
  render(){
    const {word} = this.state;
    return(
      <div className={sc('searchContainer')}>
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
          className={sc('input')}
          type='search'
          value={word}
          onChange={this.handleWordChange}
          onKeyPress={this.handleKeyPress}/>
      </div>
    );
  }
}
SearchInput.defaultProps = {
  category: '',
  type: '',
  word: '',
  toggleSearchModal: ()=> {console.log('SearchModal props Error');}

};
SearchInput.propTypes = {
  category: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  word: PropTypes.string.isRequired,
  toggleSearchModal: PropTypes.func.isRequired,


};
export default SearchInput;
