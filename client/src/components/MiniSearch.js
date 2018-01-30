import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import classNames from 'classnames/bind';

import scss from '../../../style/Search.scss';

const sc = classNames.bind(scss);

class MiniSearch extends Component{

  state = {
    word: '',
  }
  handleWordChange = (e) => {
    this.setState({
      word : e.target.value,
    });
  }
  handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      const {word} = this.state;
      if(!word && !word.trim()){
        return ;
      }
      browserHistory.push(`/search/all/${word.trim()}`);
      this.setState({
        word: '',
      });
    }
  }
  render(){
    const {word} = this.state;
    return(
      <div className={sc('mini-search-container')}>
        <input
          placeholder='Search Anything...'
          className={sc('mini-input')}
          type='search'
          value={word}
          onChange={this.handleWordChange}
          onKeyPress={this.handleKeyPress}/>
      </div>
    );
  }
}
export default MiniSearch;
