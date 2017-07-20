import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';

import FaSearch from 'react-icons/fa/search';

import styles from '../../../style/main.css';

const searchbarStyle={
  width: '30%'
};
const hintStyle={
  fontSize: '1vw'
};

class Searchbar extends Component{
  constructor(props){
    super(props);
    this.state = {
      search: '',
    };
  }
  handleChange = (e) => {
    this.setState({
      search : e.target.value,
    });
  }
  handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
    }
  }
  render(){
    const {search} = this.state;
    return(
      <div>
        <FaSearch/>
        &nbsp;
        <TextField
          style={searchbarStyle}
          hintText='검색어 입력 후 엔터'
          hintStyle={hintStyle}
          value={search}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    );
  }
}

Searchbar.propTypes = {

};
export default Searchbar;
