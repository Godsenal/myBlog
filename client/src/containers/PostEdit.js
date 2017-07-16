import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';

import styles from '../../../style/main.css';
import {addPost} from '../actions/post';

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{'list': 'ordered'}, {'list': 'bullet'},
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
];

class PostEdit extends Component {


  constructor(props) {
    super(props);
    this.state = {
      type: 'view',
      title: '',
      content: '',
      open: false,
      message: '',
      snackOpen: false,
      snackMessage: '',
    };
  }
  componentDidMount() {
  }
  handleContentChange = (value) => {
    this.setState({ content: value });
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
      content: this.state.content,
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
          <h2>Title</h2>
          <TextField
            id="text-field-default"
            fullWidth={true}
            onChange={this.handleTitleChange}/>
          <Divider
            style={{'marginTop':'3rem', 'marginBottom':'3rem'}}/>
          <h2>Content</h2>
          <ReactQuill
            theme='snow'
            modules={modules}
            formats={formats}
            value={this.state.content}
            onChange={this.handleContentChange} />
          <RaisedButton style={{'marginTop':'3rem'}} primary label="새 글 등록" fullWidth={true} onTouchTap={this.handleAddPost}/>
          <Dialog
            title="새 글 등록"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}>
            {this.state.message}
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
