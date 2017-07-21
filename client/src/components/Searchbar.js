import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import FaSearch from 'react-icons/fa/search';

const styles = {
  iconStyle: {
    cursor: 'pointer'
  },
  dialogStyle: {
    background: 'black',
  },
  searchbarStyle: {
    width:'100%'
  },
  hintStyle: {
    fontSize: 16,
  }
};
class Searchbar extends Component{
  constructor(props){
    super(props);
    this.state = {
      type:'title',
      word: '',
      open: false,
    };
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({
      open: false,
      type: 'title',
      word: ''
    });
  };

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
      this.props.handleSearchPost(this.state.word, this.state.type);
      this.handleClose();
    }
  }

  /*
  <TextField
    style={searchbarStyle}
    hintText='검색어 입력 후 엔터'
    hintStyle={hintStyle}
    value={search}
    onChange={this.handleChange}
    onKeyPress={this.handleKeyPress}
  />
  */
  render(){
    const {word, open} = this.state;
    return(
      <div style={{'display':'inline','float':'right'}}>
        <FaSearch onClick={this.handleOpen} style={styles.iconStyle}/>
          <Dialog
            modal={false}
            open={open}
            actions={[
              <FlatButton
                label="취소"
                primary={true}
                onTouchTap={this.handleClose}
              />
            ]}
            onRequestClose={this.handleClose}>
            <SelectField
              floatingLabelText='카테고리'
              value={this.state.type}
              onChange={this.handleTypeChange}
              autoWidth={true}>
              <MenuItem value={'title'} primaryText='제목' />
              <MenuItem value={'text'} primaryText='내용' />
              <MenuItem value={'all'} primaryText='제목+내용' />
            </SelectField>
            <TextField
              style={styles.searchbarStyle}
              floatingLabelText='검색어'
              floatingLabelFixed
              hintText='검색어 입력 후 엔터'
              hintStyle={styles.hintStyle}
              value={word}
              onChange={this.handleWordChange}
              onKeyPress={this.handleKeyPress}
            />
          </Dialog>
      </div>
    );
  }
}

Searchbar.defaultProps = {
  handleSearchPost: ()=> {console.log('Searchbar Props Error');}
};
Searchbar.propTypes = {
  handleSearchPost: PropTypes.func.isRequired,
};
export default Searchbar;
