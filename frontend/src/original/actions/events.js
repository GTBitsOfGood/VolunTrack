import * as types from './types.js';
import axios from 'axios';
import { push } from 'react-router-redux';

function currentEvent(id) {
  return {
    type: types.UPDATE_CURRENT_EVENT,
    id
  };
}

export function updateCurrentEvent(id) {
  return (dispatch, getState) => {
    dispatch(currentEvent(id));
    dispatch(push(`/events/${id}`));
  };
}

export function updateEventArray(events) {
  return { type: types.UPDATE_EVENT_ARRAY, events };
}

// export function onCreateEvent(createEvent) {
//   return { type: types.CREATE_EVENT, createEvent};
// }
function newEvents(newest) {
  return {
    type: types.LOAD_NEWEST_EVENTS,
    newest
  };
}

export function loadNewEvents() {
  return dispatch => {
    axios.get('/api/events?type=new').then(({ data }) => {
      dispatch(newEvents(data.events));
    });
  };
}

function allEvents(all) {
  return {
    type: types.LOAD_ALL_EVENTS,
    all
  };
}

export function loadAllEvents(id) {
  return dispatch => {
    axios.get('/api/events').then(({ data }) => {
      dispatch(allEvents(data.events));
      if (id) dispatch(currentEvent(id));
    });
  };
}

export function onCreateEvent() {
  return (dispatch, getState) => {
    const {
      name,
      description,
      date,
      location,
      max_volunteers,
      contact,
      link,
      additional_background_check
    } = getState().forms.event;
    axios
      .post('/api/events', {
        name,
        description,
        date,
        location,
        max_volunteers,
        contact,
        link,
        additional_background_check
      })
      .then(({ data }) => {
        console.log(data);
        dispatch(push('/events'));
      });
  };
}

export function onLoadEvent() {
  return dispatch => {
    axios.get('/api/events').then(({ data }) => {
      dispatch(updateEventArray(data.events));
    });
  };
}

export function onSignUp() {
  console.log('called');
  return (dispatch, getState) => {
    const volunteers = [];
    const userId = getState().auth.user._id;
    console.log('this is volunteer ID:' + userId);
    volunteers.push(userId); // TODO:volunteers
    const events = [];
    const stringevents = getState().events.current_event._id;
    console.log('this is event ID:' + stringevents);
    events.push(stringevents);
    axios.put(`/api/events/${stringevents}?action=appendVolunteers`, { volunteers }).then(resp => {
      console.log('updated events object, volunteer array');
      dispatch();
    });
    axios
      .put(`/api/users/${userId}?action=appendEvent`, { events })
      .then(resp => {
        alert("You're signed up!");
        location.reload(true);
      })
      .catch(resp => {
        console.log('appendEvent');
        console.log(resp);
      });
  };
}

export function unSignUp() {
  return (dispatch, getState) => {
    const volunteers = [];
    const userId = getState().auth.user._id;
    console.log('this is volunteer ID:' + userId);
    volunteers.push(userId); // TODO:volunteers
    const events = [];
    const stringeventID = getState().events.current_event._id;
    console.log('this is event ID:' + stringeventID);
    events.push(stringeventID);
    axios.put(`/api/events/${stringeventID}?action=removeVolunteers`, { volunteers }).then(resp => {
      console.log('updated events object, volunteer array');
    });
    axios.put(`/api/users/${userId}?action=removeEvents`, { events }).then(resp => {
      console.log(resp);
      alert('Successfully unregistered!');
      location.reload(true);
    });
  };
}
