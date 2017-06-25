import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import {App, Home, Post} from './containers';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App} >
          <IndexRoute component={Home} />
          <Route path="category/:category" component={Post} >
            <Route path=":postID" component={Post}/>
          </Route>
        </Route>
      </Router>
  </Provider>
  ,
  document.getElementById('root')
);
