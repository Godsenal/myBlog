import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

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
  //For , Push 와 Map , Filter 중 무엇이 더 빠를까
  handleNestedItems(list,category){
    var nestedItems = [];
    for(var i=0; i<list.categories.length; i++){
      if(list.categories[i].parent && category.name == list.categories[i].parent){
        nestedItems.push(
            <ListItem
              key={i}
              nestedItems={
                this.handleNestedItems(list,list.categories[i])
              }>{list.categories[i].name}
            </ListItem>
        )
      }
    }
    /*
    var nestedItems = list.categories.map((subCategory,i)=>{
      //sub Category의 parent가 자신과 같은 자신의 nestedItems로 render
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
    nestedItems = nestedItems.filter(Boolean); // undefined 제거
    */

    return nestedItems;
  }
  render(){
    const {list} = this.props.category;
    return(
      <Drawer width={400} openSecondary={true} open={true} >
        <div style={{'fontSize':'3em'}}>이태희의 블로그</div>
        <Divider inset={true} style={{'marginTop':'3rem'}} />
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
