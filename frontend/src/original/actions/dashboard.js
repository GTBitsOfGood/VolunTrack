// NPM Import
import axios from 'axios';

// Action Creators
import * as types from './types';

export function loadAllVolunteers() {
  return dispatch => {
    axios.get('/api/users?type=volunteer').then(({ data }) => {
      dispatch(allVolunteers(data.users));
    });
  };
}
export function loadDeletedVolunteers() {
  return dispatch => {
    axios.get('/api/users?type=deleted').then(({ data }) => {
      dispatch(loadDeletedVolunteers(data.users));
    });
  };
}
export function loadNewVolunteers() {
  return dispatch => {
    axios.get('/api/users?type=pending').then(({ data }) => {
      dispatch(loadPendingVolunteers(data.users));
    });
    axios.get('/api/users?type=denied').then(({ data }) => {
      dispatch(loadDeniedVolunteers(data.users));
    });
    axios.get('/api/users?type=new').then(({ data }) => {
      dispatch(loadNewVolunteers(data.users));
    });
    axios.get('/api/events?type=new').then(({ data }) => {
      dispatch(loadNewEvents(data.events));
    });
  };
}
export function loadPendingVolunteers() {
  return dispatch => {
    axios.get('/api/users?type=pending').then(({ data }) => {
      dispatch(loadPendingVolunteers(data.users));
    });
    axios.get('/api/users?type=new').then(({ data }) => {
      dispatch(loadNewVolunteers(data.users));
    });
    axios.get('/api/events?type=new').then(({ data }) => {
      dispatch(loadNewEvents(data.events));
    });
  };
}

export function loadDeniedVolunteers() {
  return dispatch => {
    axios.get('/api/users?type=denied').then(({ data }) => {
      dispatch(loadDeniedVolunteers(data.users));
    });
    axios.get('/api/events?type=new').then(({ data }) => {
      dispatch(loadNewEvents(data.events));
    });
  };
}

export function onLoad() {
  return dispatch => {
    axios.get('/api/users?type=pending').then(({ data }) => {
      dispatch(loadPendingVolunteers(data.users));
    });
    axios.get('/api/users?type=denied').then(({ data }) => {
      dispatch(loadDeniedVolunteers(data.users));
    });
    axios.get('/api/users?type=new').then(({ data }) => {
      dispatch(loadNewVolunteers(data.users));
    });
    axios.get('/api/events?type=new').then(({ data }) => {
      dispatch(loadNewEvents(data.events));
    });
  };
}

function loadPendingVolunteers(pending) {
  return {
    type: types.LOAD_PENDING_VOLUNTEERS,
    pending
  };
}
function loadDeniedVolunteers(denied) {
  return {
    type: types.LOAD_DENIED_VOLUNTEERS,
    denied
  };
}
function loadDeletedVolunteers(deleted) {
  return {
    type: types.LOAD_DELETED_VOLUNTEERS,
    deleted
  };
}

function loadNewVolunteers(newest) {
  return {
    type: types.LOAD_NEWEST_VOLUNTEERS,
    newest
  };
}
function allVolunteers(all) {
  return {
    type: types.LOAD_ALL_VOLUNTEERS,
    all
  };
}

function loadNewEvents(newest) {
  return {
    type: types.LOAD_NEWEST_EVENTS,
    newest
  };
}
