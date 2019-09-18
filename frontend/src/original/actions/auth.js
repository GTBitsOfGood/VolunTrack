// NPM Import
import axios from 'axios';
import { push } from 'react-router-redux';

// Action Creators
import * as types from './types';

/*
 * Login Async Action Creator
 */
export function login() {
  return (dispatch, getState) => {
    // using Thunks
    const { email, password } = getState().forms.user.bio;
    axios
      .post('/api/login', { email, password })
      .then(resp => {
        dispatch(loginGenerator(resp.data.user));
      })
      .catch(err => dispatch(loginGenerator()));
  };
}

/*
 * Login/Registration Failure Acceptance Async Action Creator
 */
export function acceptAuthFailure() {
  return (dispatch, getState) => {
    dispatch(authFailureAcceptanceGenerator());
  };
}

/*
 * Registration Async Action Creator
 */
export function register() {
  return (dispatch, getState) => {
    const {
      bio,
      history,
      availability,
      skills_interests,
      referral,
      employment,
      ice,
      reference,
      criminal,
      permissions
    } = getState().forms.user;
    const bioCopy = Object.assign({}, bio, { role: 'pending' });
    axios
      .post('/api/users', {
        bio: bioCopy,
        history,
        availability,
        skills_interests,
        referral,
        employment,
        ice,
        reference,
        criminal,
        permissions
      })
      .then(resp => {
        if (resp.data.user) dispatch(push('/login'));
        dispatch(registerGenerator(resp.data.user));
      })
      .catch(err => dispatch(registerGenerator()));
  };
}

/*
 * Logout Async Action Creator
 */
export function logout() {
  return function(dispatch, getState) {
    sessionStorage.removeItem('state');
    dispatch(push('/login'));
    axios.get('/api/logout').then(resp => dispatch(logoutGenerator()));
  };
}

/*
 * Helper Action Creator Generators
 */
function loginGenerator(user) {
  return user ? { type: types.LOGIN_SUCCESS, user } : { type: types.LOGIN_FAILED };
}

function registerGenerator(user) {
  return user ? { type: types.REGISTRATION_SUCCESS } : { type: types.REGISTRATION_FAILED };
}

function logoutGenerator() {
  return { type: types.LOGOUT };
}

function authFailureAcceptanceGenerator() {
  return { type: types.AUTH_FAILURE_ACCEPTED };
}
