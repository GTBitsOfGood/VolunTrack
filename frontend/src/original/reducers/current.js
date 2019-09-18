import * as types from '../actions/types';

// export default events;
const initialState = {
  currentEvent: '',
  currentVolunteer: ''
};
export default function events(state = initialState, action) {
  switch (action.type) {
    case types.CURRENT_EVENT:
      return Object.assign({}, state, { currentEvent: action.currentEvent });
    case types.CURRENT_VOLUNTEER:
      return Object.assign({}, state, { currentVolunteer: action.currentVolunteer });
    default:
      return state;
  }
}
