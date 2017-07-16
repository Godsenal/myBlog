import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';

import Drawer from 'material-ui/Drawer';
import {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import MdAddCircleOutline from 'react-icons/md/add-circle-outline';

import {addCategory, listCategory, updateCategory, deleteCategory} from '../actions/category';

import styles from '../../../style/main.css';

class Sidebar extends Component{
  constructor(props) {
    super(props);
    this.state = {
      categoryName: '',
      parentName: '',
      modalOpen: false,
      snackOpen: false,
      snackMessage: '',
    };
    this.handleNestedItems = this.handleNestedItems.bind(this);
  }
  componentDidMount(){
    this.props.listCategory();
  }
  //For , Push 와 Map , Filter 중 무엇이 더 빠를까
  //For 문 사용하면 onTouchtap 인자가 제대로 형성이 안됨.
  handleNestedItems(list,category){
    /*

    var nestedItems = [];

    for(var i=0; i<list.categories.length; i++){
      if(list.categories[i].parent && category.name == list.categories[i].parent){
        var name = list.categories[i].name;
        nestedItems.push(
            <ListItem
              key={i}
              onTouchTap={()=>{this.handleSelectCategory();}}
              primaryText={name}
              nestedItems={
                this.handleNestedItems(list,list.categories[i])
              }>
            </ListItem>
        );
      }
    }


    nestedItems.push(
      <ListItem
        key={list.categories.length}
        onTouchTap={() => {this.handleOpenModal(category.name);}}><MdAddCircleOutline/>
      </ListItem>
    );
    /* Need Authentication */

    var nestedItems = list.categories.map((subCategory,i)=>{
      //sub Category의 parent가 자신과 같은 자신의 nestedItems로 render
      if(subCategory.parent && subCategory.parent == category.name){
        return (
          <ListItem
            key={i}
            onTouchTap={()=>{this.handleSelectCategory(subCategory.name);}}
            nestedItems={
              this.handleNestedItems(list,subCategory)
            }>{subCategory.name}
          </ListItem>);
      }
    });

    /* Need Authentication */
    nestedItems.push(
      <ListItem
        key={list.categories.length}
        onTouchTap={() => {this.handleOpenModal(category.name);}}><MdAddCircleOutline/>
      </ListItem>
    );
    nestedItems = nestedItems.filter(Boolean); // undefined 제거

    return nestedItems;
  }
  handleChange = (e) => {
    this.setState({
      categoryName: e.target.value,
    });
  }
  handleOpenModal = (parentName) => {
    this.setState({
      categoryName: '',
      parentName,
      modalOpen: true,
    });
  }
  handleCloseModal = () => {
    this.setState({
      categoryName: '',
      parentName: '',
      modalOpen: false,
    });
  }
  handleSnackClose = () => {
    this.setState({
      snackMessage: '',
      snackOpen: false,
    });
  }
  /* Add Category */
  handleAddCategory = () => {
    var {categoryName, parentName} = this.state;
    if(categoryName.length == 0 || !categoryName.trim()){
      this.setState({
        snackOpen: true,
        snackMessage: '카테고리 이름을 입력해주세요.',
      });
    }else{
      this.handleCloseModal();
      var category = {
        name: categoryName,
        parent: parentName,
      };
      this.props.addCategory(category)
        .then(()=>{
          if(this.props.category.add.status == 'SUCCESS'){
            this.setState({
              snackOpen: true,
              snackMessage: '정상적으로 등록되었습니다.',
            });
          }
          else{
            this.setState({
              snackOpen: true,
              snackMessage: '등록에 실패하였습니다.',
            });
          }
        });
    }
  }
  renderAddCategory = () => {
    const actions = [
      <FlatButton
        label="추가"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleAddCategory}
      />,
      <FlatButton
        label="취소"
        keyboardFocused={true}
        onTouchTap={this.handleCloseModal}
      />,
    ];

    return (
      <Dialog
        title="새 카테고리 추가"
        actions={actions}
        modal={false}
        open={this.state.modalOpen}
        onRequestClose={this.handleCloseModal}>
        <TextField
          hintText="카테고리 명"
          floatingLabelText="새 카테고리"
          fullWidth={true}
          onChange={this.handleChange} />
      </Dialog>
    );
  }
  /*Select Category*/
  handleSelectCategory(categoryName){
    browserHistory.push('/category/'+categoryName);
    if(this.props.isMobile){
      this.props.toggleSidebar();
    }
  }
  handleHeaderClick = () => {
    browserHistory.push('/');
  }
  render(){
    const {list} = this.props.category;
    return(
      <Drawer
        width={400}
        docked={!this.props.isMobile}
        onRequestChange={this.props.isMobile? this.props.toggleSidebar:null}
        openSecondary={true}
        open={this.props.open || !this.props.isMobile}
        containerStyle={{'backgroundColor':'#ECF0F1'}}
        style={{'textAlign':'center'}}>
        <div style={{'fontSize':'2em','margin':'3rem','textAlign':'center','display':'block'}}>
          <span className={styles.header} onClick={this.handleHeaderClick}>LTH's Blog</span>
        </div>
        <Divider inset={true} style={{'margin':'3rem'}} />
        {list.categories.map((category,i)=>{
          if(!category.parent){
            return (
              <ListItem
                key={i}
                onTouchTap={()=>{this.handleSelectCategory(category.name); }}
                nestedItems={
                  this.handleNestedItems(list,category)
                }><span>{category.name}</span>
              </ListItem>);
          }
        })}
        <ListItem
          onTouchTap={() => {this.handleOpenModal();}}><MdAddCircleOutline/>
        </ListItem>
        <Snackbar
          open={this.state.snackOpen}
          message={this.state.snackMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackClose}
        />
      {this.renderAddCategory()}
      </Drawer>
    );
  }
}

Sidebar.defaultProps ={
  isMobile: false,
  open: false,
  toggleSidebar : () => {console.log('Sidebar props Error');},
  params: {},
  category: {},
  addCategory : () => {console.log('Sidebar props Error');},
  listCategory : () => {console.log('Sidebar props Error');},
  updateCategory : () => {console.log('Sidebar props Error');},
  deleteCategory : () => {console.log('Sidebar props Error');},
};
Sidebar.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  toggleSidebar : PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
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
      return dispatch(updateCategory(category));
    },
    deleteCategory: (category) => {
      return dispatch(deleteCategory(category));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
