import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import axios from 'axios';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import FaFileImageO from 'react-icons/fa/file-image-o';
import FaTag from 'react-icons/fa/tag';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


import styles from '../../../style/main.css';
import {addPost, getPost, updatePost, deletePost} from '../actions/post';
import {getStatusRequest} from '../actions/authentication';

const path = '/assets/posts/images/';
const thumbnailPath = '/assets/posts/thumbnails/';


class PostEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: 'new',
      title: '',
      thumbnail: '',
      content: '',
      text: '',
      tags: [],
      tagString: '',
      open: false,
      message: '',
      thumbnailOpen : false,
      imageOpen : false,
      tagOpen : false,
      file: '',
      files: [],
      snackOpen: false,
      snackMessage: '',
      thumnailPreviewUrl: '',
      imagePreviewUrl: [],
      isSaved: false,
    };
    this.quillRef = null;      // Quill instance
    this.reactQuillRef = null; // ReactQuill component

    this.modules = {
      toolbar: {
        container: [
          [{ 'header': '1'}, {'header': '2'}],
           [{font:[]}],
          [{size: []}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
          [{'list': 'ordered'}, {'list': 'bullet'},
           {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image', 'video'],
          ['clean']
        ],
        handlers: {
          'image': this.handleImage
        }
      }
    };

    this.formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
      'list', 'bullet', 'indent',
      'link', 'image', 'video'
    ];
  }
  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  }
  componentDidMount() {
    window.addEventListener('beforeunload',this.handleBackButton);
    this.props.router.setRouteLeaveHook(this.props.route, this.handleLeave);
    let token = localStorage.getItem('token');
    this.props.getStatusRequest(token)
      .then(()=>{
        let status = this.props.authentication.status;
        if(!status.valid){
          browserHistory.replace('/');
        }

        if(this.props.params.postID){
          this.props.getPost(this.props.params.postID)
            .then(()=>{
              if(this.props.post.get.status === 'SUCCESS'){
                let post = this.props.post.get.post;
                this.setState({
                  type: 'edit',
                  title: post.title,
                  thumbnail: post.thumbnail,
                  content: post.content,
                  text: post.text,
                  tags: post.tags,
                });
              }
              else if(this.props.post.get.status === 'FAILURE'){
                browserHistory.replace('/NotFound');
              }
            });
        }
      });
    this.attachQuillRefs();
  }
  componentWillUnmount(){
    window.removeEventListener('beforeunload',this.handleBackButton);
  }
  componentDidUpdate() {
    this.attachQuillRefs();
  }
  handleLeave = ()=>{
    if(!this.state.isSaved)
      return 'Your work is not saved! Are you sure you want to leave?';
  }
  handleBackButton = (e) => {
    e = e || window.event;

  // For IE<8 and Firefox prior to version 4
    if (e && !this.isSaved) {
      e.returnValue = 'Your work is not saved! Are you sure you want to leave?';
    }

    // For Chrome, Safari, IE8+ and Opera 12+
    return 'Your work is not saved! Are you sure you want to leave?';
  }
  /* HANDLE THUMBNAIL */
  handleThumbnailChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        thumbnailPreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file);
  }
  handleThumbnailUpload = () => {
    let formData = new FormData();
    formData.append('file', this.state.file);
    axios.post('/api/image/thumbnail', formData)
      .then((res)=>{
        this.setState({
          thumbnail: res.data.filename,
        });
        this.closeThumbnailDialog();
      });

  }
  openThumbnailDialog = () => {
    this.setState({
      thumbnailOpen: true,
    });
  }
  closeThumbnailDialog = () => {
    this.setState({
      thumbnailOpen: false,
      thumbnailPreviewUrl: '',
      file: '',
    });
  }
  renderThumbnailPreview = () => {
    let thumbnailPreview = null;
    if (this.state.thumbnailPreviewUrl) {
      thumbnailPreview = (
        <div>
          <img style={{'height':200}} src={this.state.thumbnailPreviewUrl} />
          <FlatButton
            label="선택"
            fullWidth={true}
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleThumbnailUpload}
          />
        </div>);
    } else {
      thumbnailPreview = (<div>이미지를 먼저 선택해주세요.</div>);
    }
    return(
      <div style={{'textAlign':'center'}}>
        <h2>미리보기</h2>
        {thumbnailPreview}
      </div>
    );
  }
  renderThumbnail = () => {
    const {thumbnail} = this.state;
    if(thumbnail){
      return(
        <div>
          <img style={{'height':200}} src={thumbnailPath + thumbnail} />
          <IconButton
            onTouchTap={() => this.setState({thumbnail: ''})}
            tooltip='지우기'>
            <NavigationClose />
          </IconButton>
        </div>
      );
    }
  }

  /* HANDLE IMAGE */
  handleImageChange = (e) => {
    e.preventDefault();
    let files = [];
    let urls = [];
    for (var i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      files.push(file);
      urls.push(URL.createObjectURL(file));
    }
    this.setState({
      files: files,
      imagePreviewUrl: urls,
    });
  }

  handleImageUpload = () => {
    let formData = new FormData();
    var range = this.quillRef.getSelection();
    for(var i =0; i< this.state.files.length; i++){
      formData.append('file', this.state.files[i]);
    }
    axios.post('/api/image/images', formData)
      .then((res)=>{
        var values = res.data.filenames;
        if(values) {
          for(var i =0; i< values.length; i++){
            this.quillRef.insertEmbed(range.index, 'image', path+values[i], 'user');
          }
        }
        this.closeImageDialog();
      });
  }
  handleImage = () => {
    this.setState({
      imageOpen : true
    });
    /*
    var range = this.quillRef.getSelection();
    var value = prompt('What is the image URL');
    if(value) {
      this.quillRef.insertEmbed(range.index, 'image', value, 'user');
    }
    */
  }
  closeImageDialog = () => {
    this.setState({
      imageOpen: false,
      imagePreviewUrl: [],
      files: [],
    });
  }
  renderImagePreview = () => {
    let imagePreview = null;
    if (this.state.imagePreviewUrl.length) {
      imagePreview = (
        <div>
          {this.state.imagePreviewUrl.map((url, i)=>{
            return <img key= {i} style={{'width':150,'marginRight':30}} src={url} />;
          })}
          <FlatButton
            label="업로드"
            fullWidth={true}
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleImageUpload}
          />
        </div>);
    } else {
      imagePreview = (<div>이미지를 먼저 선택해주세요.</div>);
    }
    return(
      <div style={{'textAlign':'center'}}>
        <h2>미리보기</h2>
        {imagePreview}
      </div>
    );
  }
  /* HANDLE NORMAL POST */
  handleContentChange = (value, delta, source, editor) => {
    this.setState({
      content: value,
      text: editor.getText()
    });
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value});
  }

  handleAddPost = () => {
    var {title, content} = this.state;
    if(title.length === 0 || !title.trim()){
      this.setState({
        snackOpen: true,
        snackMessage: '제목을 입력하세요.',
      });
      return;
    }

    if(content.length === 0 || !content.trim()){
      this.setState({
        snackOpen: true,
        snackMessage: '내용을 입력하세요.',
      });
      return;
    }

    var post = {
      author: 'godsenal',
      title: this.state.title,
      thumbnail: this.state.thumbnail,
      content: this.state.content,
      text: this.state.text,
      tags: this.state.tags,
      category: this.props.params.category,
    };
    let token = localStorage.getItem('token');
    this.props.getStatusRequest(token)
      .then(()=>{
        let status = this.props.authentication.status;
        if(!status.valid){
          browserHistory.replace('/');
        }
        this.props.addPost(post)
          .then(()=>{
            if(this.props.post.add.status == 'SUCCESS'){
              this.setState({
                open: true,
                isSaved: true,
                message: '글이 정상적으로 등록되었습니다.'
              });
            }else{
              this.setState({
                open: true,
                message: '등록에 실패하였습니다.'
              });
            }
          });
      });
  }
  handleEditPost = () =>{
    const {title, content, text, thumbnail, tags} = this.state;
    const _id = this.props.params.postID;
    if(title.length === 0 || !title.trim()){
      this.setState({
        snackOpen: true,
        snackMessage: '제목을 입력하세요.',
      });
      return;
    }

    if(content.length === 0 || !content.trim()){
      this.setState({
        snackOpen: true,
        snackMessage: '내용을 입력하세요.',
      });
      return;
    }

    if(!this.props.params.postID){
      this.setState({
        snackOpen: true,
        snackMessage: '잘못된 접근입니다.',
      });
      return;
    }
    var post = {
      _id,
      title,
      thumbnail,
      content,
      text,
      tags,
    };
    let token = localStorage.getItem('token');
    this.props.getStatusRequest(token)
      .then(()=>{
        let status = this.props.authentication.status;
        if(!status.valid){
          browserHistory.replace('/');
        }
        this.props.updatePost(post)
          .then(()=>{
            if(this.props.post.update.status == 'SUCCESS'){
              this.setState({
                open: true,
                isSaved: true,
                message: '글이 정상적으로 수정되었습니다.'
              });
            }else{
              this.setState({
                open: true,
                message: '수정에 실패하였습니다.'
              });
            }
          });
      });
  }
  handleDeletePost = () =>{
    const _id = this.props.params.postID;

    if(!this.props.params.postID){
      this.setState({
        snackOpen: true,
        snackMessage: '잘못된 접근입니다.',
      });
      return;
    }
    let token = localStorage.getItem('token');
    this.props.getStatusRequest(token)
      .then(()=>{
        let status = this.props.authentication.status;
        if(!status.valid){
          browserHistory.replace('/');
        }
        this.props.deletePost(_id)
          .then(()=>{
            if(this.props.post.delete.status == 'SUCCESS'){
              this.setState({
                open: true,
                isSaved: true,
                message: '글이 정상적으로 삭제되었습니다.'
              });
            }else{
              this.setState({
                open: true,
                message: '삭제에 실패하였습니다.'
              });
            }
          });
      });
  }
  /* HANDLE TAG */
  handleTagChange = (e) => {
    this.setState({ tagString: e.target.value});
  }
  handleTagKeyPress = (e) => {
    if(e.key == 'Enter'){
      this.closeTagPopover();
    }
  }
  handleRemoveTag = (rmTag) => {
    this.setState((prevState) => ({
      tags: prevState.tags.filter((tag) => tag != rmTag)
    }));

  }
  openTagPopover = (e) => {
    e.preventDefault();
    this.setState({
      tagOpen: true,
      anchorEl: e.currentTarget,
    });
  }

  closeTagPopover = () => {
    let tagTmp = [];
    if(this.state.tagString){
      tagTmp = this.state.tagString.split(',').map((tag)=>{
        return tag.trim();
      }).filter(Boolean);
    }
    this.setState({
      tagOpen: false,
      tagString: '',
      tags: this.state.tags.concat(tagTmp),
    });
  }

  renderTag = () => {
    const {tags} = this.state;
    if(tags.length){
      return(
        <div style={{'display':'inline'}}>
        <FaTag />
        {tags.map((tag, i)=>{
          return(
            <Badge
              key={i}
              badgeContent={
                <IconButton
                  iconStyle={{'width':10,'height':10,padding:0,color:'black'}}
                  onTouchTap={() => this.handleRemoveTag(tag)}
                  tooltip='지우기'>
                  <NavigationClose />
                </IconButton>}>
              <span style={{'fontSize':'0.8em'}}>
                {tag}
              </span>
            </Badge>);})
          }
        </div>
      );
    }
  }

  /* HANDLE ETC */
  handleClose = () =>{
    browserHistory.replace(`/category/${this.props.params.category}`);
  }

  /* Do i need this? */
  handleSnackClose = () => {
    this.setState({
      snackOpen: false,
    });
  }


  render() {
    const actions = [
      <FlatButton
        label="확인"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />
    ];
    return (
      <div className={styles.postContainer}>
        <Paper zDepth={2} className={styles.paperContainer}>
          <span>제목 </span>
          <TextField
            id="text-field-default"
            multiLine={true}
            style={{'width':'100%'}}
            value={this.state.title}
            onChange={this.handleTitleChange}/>
          <div>
            {this.renderThumbnail()}
            <FlatButton
              label={this.state.thumbnail?'대표 이미지 변경':'대표 이미지 추가'}
              secondary={true}
              labelPosition={'before'}
              icon={<FaFileImageO />}
              onTouchTap={this.openThumbnailDialog}/>
          </div>
          <ReactQuill
            theme='snow'
            ref={(el) => { this.reactQuillRef = el; }}
            modules={this.modules}
            formats={this.formats}
            value={this.state.content}
            onChange={this.handleContentChange} >
            <div className={styles.editorContainer}/>
          </ReactQuill>
          <div>
            {this.renderTag()}
            <FlatButton
              style={{'display':'inline'}}
              secondary={true}
              label={'태그 추가'}
              labelPosition={'before'}
              icon={<FaTag />}
              onTouchTap={this.openTagPopover}/>
            <Popover
              open={this.state.tagOpen}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.closeTagPopover}>
              <div style={{'padding':20}}>
                <TextField
                  id="text-field-default"
                  hintText='쉼표로 태그 구분'
                  floatingLabelText='태그'
                  floatingLabelFixed={true}
                  onKeyPress={this.handleTagKeyPress}
                  onChange={this.handleTagChange}/>
              </div>
            </Popover>
          </div>
          <RaisedButton
            style={{'marginTop':'3rem'}}
            primary
            label={this.state.type==='edit'?'수정 완료':'새 글 등록'}
            fullWidth={true}
            onTouchTap={this.state.type==='edit'?this.handleEditPost:this.handleAddPost}/>
          {this.state.type==='edit'?
            <RaisedButton
              style={{'marginTop':'3rem'}}
              secondary
              label={'이 글 삭제'}
              fullWidth={true}
              onTouchTap={this.handleDeletePost}/>:null}
          <Dialog
            title={this.state.type==='edit'?'수정 완료':'새 글 등록'}
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}>
            {this.state.message}
          </Dialog>
          <Dialog
            title={this.state.thumbnail?'대표 이미지 변경':'대표 이미지 추가'}
            modal={false}
            open={this.state.thumbnailOpen}
            autoScrollBodyContent={true}
            onRequestClose={this.closeThumbnailDialog}>
            <input
              type='file'
              onChange={this.handleThumbnailChange}/>
            {this.renderThumbnailPreview()}
          </Dialog>
          <Dialog
            title="이미지 업로드"
            modal={false}
            open={this.state.imageOpen}
            autoScrollBodyContent={true}
            onRequestClose={this.closeImageDialog}>
            <input
              type='file'
              multiple
              onChange={this.handleImageChange}/>
              {this.renderImagePreview()}
          </Dialog>
          <Snackbar
            open={this.state.snackOpen}
            message={this.state.snackMessage}
            autoHideDuration={4000}
            onRequestClose={this.handleSnackClose}
          />
        </Paper>
      </div>
    );
  }
}

PostEdit.defaultProps ={
  params: {},
  post: {},
  router: {},
  route: {},
  authentication: {},
  addPost : () => {console.log('Post props Error');},
  getPost : () => {console.log('Post props Error');},
  updatePost : () => {console.log('Post props Error');},
  deletePost: () => {console.log('Post props Error');},
};
PostEdit.propTypes = {
  params: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired,
  environment : PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  route : PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  getStatusRequest: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    post: state.post,
    authentication: state.authentication,
    environment: state.environment,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addPost: (post) => {
      return dispatch(addPost(post));
    },
    getPost: (postID) => {
      return dispatch(getPost(postID));
    },
    updatePost: (post) => {
      return dispatch(updatePost(post));
    },
    deletePost: (postID) => {
      return dispatch(deletePost(postID));
    },
    getStatusRequest: (token) => {
      return dispatch(getStatusRequest(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostEdit);
