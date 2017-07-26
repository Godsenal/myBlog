import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import axios from 'axios';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import FaFileImageO from 'react-icons/fa/file-image-o';
import FaTag from 'react-icons/fa/tag';


import styles from '../../../style/main.css';
import {addPost} from '../actions/post';

const path = '/assets/posts/images/';

class PostEdit extends Component {


  constructor(props) {
    super(props);
    this.state = {
      type: 'view',
      title: '',
      thumbnail: '',
      content: '',
      text: '',
      open: false,
      message: '',
      thumbnailOpen : false,
      imageOpen : false,
      file: '',
      files: [],
      snackOpen: false,
      snackMessage: '',
      thumnailPreviewUrl: '',
      imagePreviewUrl: [],
    };
    this.quillRef = null;      // Quill instance
    this.reactQuillRef = null; // ReactQuill component

    this.modules = {
      toolbar: {
        container: [
          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
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
    this.attachQuillRefs();
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

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
      category: this.props.params.category,
    };
    this.props.addPost(post)
      .then(()=>{
        if(this.props.post.add.status == 'SUCCESS'){
          this.setState({
            open: true,
            message: '글이 정상적으로 등록되었습니다.'
          });
        }else{
          this.setState({
            open: true,
            message: '등록에 실패하였습니다.'
          });
        }
      });
  }

  handleClose = () =>{
    browserHistory.replace(`/category/${this.props.params.category}`);
  }
  /* Do i need this? */
  handleSnackClose = () => {
    this.setState({
      snackOpen: false,
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
  closeImageDialog = () => {
    this.setState({
      imageOpen: false,
      imagePreviewUrl: [],
      files: [],
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
  renderImagePreview = () => {
    let imagePreview = null;
    if (this.state.imagePreviewUrl) {
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
            onChange={this.handleTitleChange}/>

          <ReactQuill
            theme='snow'
            ref={(el) => { this.reactQuillRef = el; }}
            modules={this.modules}
            formats={this.formats}
            value={this.state.content}
            onChange={this.handleContentChange} />
          <div style={{'float': 'right'}}>
            <FlatButton
              label={'대표 이미지'}
              labelPosition={'before'}
              icon={<FaFileImageO />}
              onTouchTap={this.openThumbnailDialog}/>
            <FlatButton
              label={'태그 추가'}
              labelPosition={'before'}
              icon={<FaTag />}/>
          </div>
          <RaisedButton
            style={{'marginTop':'3rem'}}
            primary
            label="새 글 등록"
            fullWidth={true}
            onTouchTap={this.handleAddPost}/>
          <Dialog
            title="새 글 등록"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}>
            {this.state.message}
          </Dialog>
          <Dialog
            title="대표이미지 등록"
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
  addPost : () => {console.log('Post props Error');},
};
PostEdit.propTypes = {
  params: PropTypes.object.isRequired,
  environment : PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    post: state.post,
    environment: state.environment,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addPost: (post) => {
      return dispatch(addPost(post));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostEdit);
