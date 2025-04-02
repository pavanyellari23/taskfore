import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import Bootstrap from './Bootstrap';
import Routes from './routes';
import store from './store';
import '@pnp-revin/utils/dist/assets/scss/index.scss';
import './Override.scss';

const browserHistory = createBrowserHistory();

const App = (props) => {
  return (
    <Provider store={store}>
      <Bootstrap />
      <Router history={browserHistory}>
        <Routes {...props} />
      </Router>
    </Provider>
  );
};

export default App;
