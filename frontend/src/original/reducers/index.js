import { combineReducers } from 'redux';
import { reducer } from 'react-redux-sweetalert';
import { routerReducer as router } from 'react-router-redux';
import events from './events.js';
import current from './current.js';
import volunteers from './volunteers.js';
import auth from './auth';
import forms from './forms';

export default combineReducers({
  auth,
  events,
  volunteers,
  current,
  forms,
  sweetalert: reducer,
  router
});
