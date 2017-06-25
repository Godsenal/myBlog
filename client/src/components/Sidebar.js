import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';

import {addCategory, listCategory, updateCategory, deleteCategory} from '../actions/category';

class Sidebar extends Component{
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleNestedItems = this.handleNestedItems.bind(this);
  }
  componentDidMount(){
    this.props.listCategory();
    this.props.addCategory({name:'wow3',parent:'wow2'});
  }

  handleNestedItems(list,category){
    var nestedItems = list.categories.map((subCategory,i)=>{

      if(subCategory.parent && subCategory.parent == category.name){
        return (
          <ListItem
            key={i}
            nestedItems={
              this.handleNestedItems(list,subCategory)
            }>{subCategory.name}
          </ListItem>);
      }
    });
    nestedItems = nestedItems.filter(Boolean);
    return nestedItems;
  }
  render(){
    const {list} = this.props.category;
    return(
      <Drawer width={'15%'} openSecondary={true} open={true} >
        {list.categories.map((category,i)=>{
          return (
            <ListItem
              key={i}
              nestedItems={
                this.handleNestedItems(list,category)
              }>{category.name}
            </ListItem>);
        })}
      </Drawer>
    )
  }
}

Sidebar.defaultProps ={
  category: {},
  addCategory : () => {console.log('Sidebar props Error');},
  listCategory : () => {console.log('Sidebar props Error');},
  updateCategory : () => {console.log('Sidebar props Error');},
  deleteCategory : () => {console.log('Sidebar props Error');},
};
Sidebar.propTypes = {
  category: PropTypes.object.isRequired,
  addCategory: PropTypes.func.isRequired,
  listCategory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    category: state.category,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addCategory: (category) => {
      return dispatch(addCategory(category));
    },
    listCategory: () => {
      return dispatch(listCategory());
    },
    updateCategory: (category) => {
      return dispatch(updateCategory());
    },
    deleteCategory: (category) => {
      return dispatch(deleteCategory());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
