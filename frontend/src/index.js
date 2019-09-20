import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider as ReduxProvider } from 'react-redux';
import { defaultTheme } from './styles';
import configureStore from './store/store';

import './index.css';
import './styles/scss/custom.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <ReduxProvider store={configureStore()}>
    <ThemeProvider theme={defaultTheme}>
      <App />
    </ThemeProvider>
  </ReduxProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
