import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import {App, Home, Post, PostView, PostEdit, Signin, NotFound} from './containers';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunk));
ReactDOM.render(
  <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App} >
          <IndexRoute component={Post} />
          <Route path="category" component={Post} >
            <Route path=":category" component={Post}/>
          </Route>
          <Route path="post">
            <Route path="edit/:postID" component={PostEdit}/>
            <Route path="new/:category" component={PostEdit}/>
            <Route path=":postID" component={PostView}/>
          </Route>
          <Route path='signin' component={Signin}/>
          <Route path='*' component={NotFound}/>
        </Route>
      </Router>
  </Provider>
  ,
  document.getElementById('root')
);
