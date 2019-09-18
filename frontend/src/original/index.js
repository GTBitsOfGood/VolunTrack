// NPM Imports
import React from 'react';
import throttle from 'lodash/throttle';
import { render } from 'react-dom';
import 'sweetalert/dist/sweetalert.css';

// Local Imports & Constants
import { configureStore, history } from './store/configureStore';
import { saveState } from './store/sessionStorage';
import './assets/stylesheets/base.scss';
import Root from './containers/Root';
const store = configureStore(history);

// saves state in session storage to perserve login on refresh
store.subscribe(throttle(() => saveState({ auth: store.getState().auth }), 1000));

render(<Root store={store} history={history} />, document.getElementById('root'));
