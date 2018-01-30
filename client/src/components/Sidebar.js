import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import classNames from 'classnames/bind';

import Drawer from 'material-ui/Drawer';
import {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import MdAddCircleOutline from 'react-icons/md/add-circle-outline';
import FaSignOut from 'react-icons/fa/sign-out';
import {grey50} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';


import {Searchbar} from './';
import {toggleSearchModal} from '../actions/environment';
import {changeActiveCategory, addCategory, listCategory, updateCategory, deleteCategory} from '../actions/category';
import {getStatusRequest, signoutRequest} from '../actions/authentication';
import styles from '../../../style/main.css';

const cx = classNames.bind(styles);

const hoverColor='#3498DB';

class Sidebar extends Component{
  constructor(props) {
    super(props);
    this.state = {
      categoryName: '',
      parentCategory: {},
      modalOpen: false,
      updateOpen: false,
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
      var re = new RegExp(','+category.name+',$');
      var isMatch = re.test(subCategory.path);
      if(subCategory.path && isMatch){
        return (
          <ListItem
            key={i}
            open={this.props.status.valid?true:null}
            onTouchTap={()=>{this.handleSelectCategory(subCategory);}}
            hoverColor={hoverColor}
            rightIconButton={this.props.status.valid?this.renderRightIconBtn(subCategory):null}
            innerDivStyle={{padding:'16px'}}
            nestedItems={
              this.handleNestedItems(list,subCategory)
            }><span className={styles.categoryList}>{subCategory.name}</span>
          </ListItem>);
      }
    });

    /* Need Authentication */
    this.props.status.valid?nestedItems.push(
      <ListItem
        key={list.categories.length}
        hoverColor={hoverColor}
        innerDivStyle={{padding:'16px'}}
        onTouchTap={() => {this.handleOpenModal(category);}}><MdAddCircleOutline className={styles.categoryList}/>
      </ListItem>
    ):null;
    nestedItems = nestedItems.filter(Boolean); // undefined 제거

    return nestedItems;
  }
  handleChange = (e) => {
    this.setState({
      categoryName: e.target.value,
    });
  }
  handleOpenModal = (parentCategory) => {
    this.setState({
      categoryName: '',
      parentCategory,
      modalOpen: true,
    });
  }
  handleOpenUpdate = (categoryID) => {
    this.setState({
      categoryName: '',
      categoryID,
      updateOpen: true,
    });
  }
  handleCloseModal = () => {
    this.setState({
      categoryName: '',
      parentCategory: {},
      modalOpen: false,
    });
  }
  handleCloseUpdate = () => {
    this.setState({
      categoryName: '',
      categoryID: '',
      updateOpen: false,
    });
  }
  handleSnackClose = () => {
    this.setState({
      snackMessage: '',
      snackOpen: false,
    });
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
  renderUpdateCategory = () => {
    const actions = [
      <FlatButton
        label="변경"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleUpdateCategory}
      />,
      <FlatButton
        label="취소"
        keyboardFocused={true}
        onTouchTap={this.handleCloseUpdate}
      />,
    ];

    return (
      <Dialog
        title="카테고리 업데이트"
        actions={actions}
        modal={false}
        open={this.state.updateOpen}
        onRequestClose={this.handleCloseUpdate}>
        <TextField
          hintText="카테고리 명"
          floatingLabelText="카테고리"
          fullWidth={true}
          onChange={this.handleChange} />
      </Dialog>
    );
  }

  renderRightIconBtn = (category) => {
    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={grey50} />
      </IconButton>
    );

    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onTouchTap={()=>this.handleOpenUpdate(category._id)}>Update</MenuItem>
        <MenuItem onTouchTap={()=>this.handleDeleteCategory(category)}>Delete</MenuItem>
      </IconMenu>
    );

    return rightIconMenu;
  }


  /*Select Category*/
  handleSelectCategory(category){
    browserHistory.push('/category/'+category.name);
    if(this.props.isMobile){
      this.props.toggleSidebar();
    }
  }
  /* Add Category */
  handleAddCategory = () => {
    var {categoryName, parentCategory} = this.state;
    if(categoryName.length == 0 || !categoryName.trim()){
      this.setState({
        snackOpen: true,
        snackMessage: '카테고리 이름을 입력해주세요.',
      });
    }else{
      var category = {
        name: categoryName,
      };

      if(parentCategory){
        if(parentCategory.path){
          category.path = parentCategory.path + parentCategory.name + ',';
        }
        else{
          category.path = ',' + parentCategory.name + ',';
        }
      }
      var token = localStorage.getItem('token');
      this.props.getStatusRequest(token)
        .then(()=>{
          if(this.props.status.valid){
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
                this.handleCloseModal();
              });
          }else{
            this.setState({
              snackOpen: true,
              snackMessage: '권한이 없습니다.',
            });
            this.handleCloseModal();
          }
        });
    }
  }
  handleDeleteCategory = (category)=>{
    let token = localStorage.getItem('token');
    this.props.getStatusRequest(token)
      .then(()=>{
        if(this.props.status.valid){
          this.props.deleteCategory(category._id, category.name)
            .then(()=>{
              if(this.props.category.delete.status == 'SUCCESS'){
                this.setState({
                  snackOpen: true,
                  snackMessage: '정상적으로 삭제되었습니다.',
                });
              }
              else{
                this.setState({
                  snackOpen: true,
                  snackMessage: '삭제에 실패하였습니다.',
                });
              }
            });
        }
        else{
          this.setState({
            snackOpen: true,
            snackMessage: '권한이 없습니다.',
          });
        }
      });
  }
  handleUpdateCategory = ()=>{
    var {categoryName, categoryID} = this.state;
    if(categoryName.length == 0 || !categoryName.trim()){
      this.setState({
        snackOpen: true,
        snackMessage: '카테고리 이름을 입력해주세요.',
      });
    }else{
      let token = localStorage.getItem('token');
      let update = {name: categoryName};
      this.props.getStatusRequest(token)
        .then(()=>{
          if(this.props.status.valid){
            this.props.updateCategory(categoryID, update)
              .then(()=>{
                if(this.props.category.update.status == 'SUCCESS'){
                  this.setState({
                    snackOpen: true,
                    snackMessage: '정상적으로 수정되었습니다.',
                  });
                }
                else{
                  this.setState({
                    snackOpen: true,
                    snackMessage: '수정에 실패하였습니다.',
                  });
                }
                this.handleCloseUpdate();
              });
          }
          else{
            this.setState({
              snackOpen: true,
              snackMessage: '권한이 없습니다.',
            });
          }
          this.handleCloseUpdate();
        });

    }
  }
  handleHeaderClick = () => {
    browserHistory.push('/');
    if(this.props.isMobile){
      this.props.toggleSidebar();
    }
  }
  handleSignout = () => {
    this.props.signoutRequest();
  }
  /* Listitem 의 open 이 false말고 null인 이유는, valid 아닐 경우 false면 절대 안열림 */
  render(){
    const {list} = this.props.category;

    return(
      <Drawer
        containerClassName={styles.font}
        width={this.props.isMobile?300:250}
        docked={!this.props.isMobile}
        onRequestChange={this.props.isMobile? this.props.toggleSidebar:null}
        openSecondary={this.props.isMobile?true:false}
        open={this.props.open || !this.props.isMobile}
        containerStyle={{'backgroundColor':'#333745'}}
        style={{'textAlign':'center'}}>
        <div style={{'fontSize':'2em','margin':'3rem 1rem','textAlign':'center','display':'block'}}>
          <span className={cx('header','headerText')} onClick={this.handleHeaderClick}>{this.props.title}</span>
        </div>
        <div style={{background: '#E0E0E0', height: 1, width: '80%', margin:'3rem auto'}} />
        {list.categories.map((category,i)=>{
          if(!category.path){
            return (
              <ListItem
                key={i}
                hoverColor={hoverColor}
                open={this.props.status.valid?true:null}
                innerDivStyle={{padding:'16px 12px'}}
                rightIconButton={this.props.status.valid?this.renderRightIconBtn(category):null}
                onTouchTap={()=>{this.handleSelectCategory(category); }}
                nestedItems={
                  this.handleNestedItems(list,category)
                }><span className={styles.categoryList}>{category.name}</span>
              </ListItem>);
          }
        })}
        <div className={styles.categoryList} style={{'marginTop':'2rem'}}>
          <div className={styles.categoryTool} onClick={this.props.isMobile? this.props.toggleSidebar:null}>
            <Searchbar toggleSearchModal={this.props.toggleSearchModal}/>
          </div>
        </div>
        {this.props.status.valid?
          <ListItem
            onTouchTap={() => {this.handleOpenModal();}}><MdAddCircleOutline className={styles.categoryList}/>
          </ListItem>:null}
        {this.props.status.valid?
          <FaSignOut
            className={styles.categoryList}
            onClick={this.handleSignout}/>:null}
        <Snackbar
          open={this.state.snackOpen}
          message={this.state.snackMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackClose}
        />
      {this.renderAddCategory()}
      {this.renderUpdateCategory()}
      </Drawer>
    );
  }
}

Sidebar.defaultProps ={
  title: '',
  isMobile: false,
  open: false,
  toggleSidebar : () => {console.log('Sidebar props Error');},
  params: {},
  category: {},
  status: {},
  changeActiveCategory : () => {console.log('Sidebar props Error');},
  addCategory : () => {console.log('Sidebar props Error');},
  listCategory : () => {console.log('Sidebar props Error');},
  updateCategory : () => {console.log('Sidebar props Error');},
  deleteCategory : () => {console.log('Sidebar props Error');},
  getStatusRequest : () => {console.log('Sidebar props Error');},
  signoutRequest : () => {console.log('Sidebar props Error');},
  toggleSearchModal : () => {console.log('Sidebar props Error');},
};
Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  toggleSidebar : PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  changeActiveCategory: PropTypes.func.isRequired,
  addCategory: PropTypes.func.isRequired,
  listCategory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  getStatusRequest: PropTypes.func.isRequired,
  signoutRequest : PropTypes.func.isRequired,
  toggleSearchModal : PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    category: state.category,
    status: state.authentication.status,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeActiveCategory: (category) => {
      return dispatch(changeActiveCategory(category));
    },
    addCategory: (category) => {
      return dispatch(addCategory(category));
    },
    listCategory: () => {
      return dispatch(listCategory());
    },
    updateCategory: (categoryID,update) => {
      return dispatch(updateCategory(categoryID,update));
    },
    deleteCategory: (categoryID, categoryName) => {
      return dispatch(deleteCategory(categoryID, categoryName));
    },
    signoutRequest: () => {
      return dispatch(signoutRequest());
    },
    getStatusRequest: (token) => {
      return dispatch(getStatusRequest(token));
    },
    toggleSearchModal: (isOpen) => {
      return dispatch(toggleSearchModal(isOpen));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
