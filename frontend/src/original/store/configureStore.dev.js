// NPM Imports
import { createStore, compose, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

// Local Imports & Constants
import DevTools from '../containers/DevTools';
import rootReducer from '../reducers/index';
import { loadState } from './sessionStorage';
const persistedState = loadState();

export function configureStore(history) {
  const middleware = [thunk, routerMiddleware(history)];
  return createStore(
    rootReducer,
    persistedState,
    compose(
      applyMiddleware(...middleware),
      DevTools.instrument()
    )
  );
}

export const history = createHistory();
