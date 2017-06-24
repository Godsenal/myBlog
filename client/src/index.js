import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import {App, Home, PostList, PostView} from './containers';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App} >
          <IndexRoute component={Home} />
          <Route path="category/:category" component={PostList} >
            <Route pathe=":postID" component={PostView}/>
          </Route>
        </Route>
      </Router>
  </Provider>
  ,
  document.getElementById('root')
);
