import * as types from '../actions/types';

const initialState = {
  newest: [],
  all: [],
  current_event: undefined
};

export default function events(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_NEWEST_EVENTS:
      return Object.assign({}, state, { newest: action.newest });
    case types.LOAD_ALL_EVENTS:
      return Object.assign({}, state, { all: action.all });
    case types.UPDATE_CURRENT_EVENT:
      if (state.all.length === 0) return state;
      return Object.assign({}, state, {
        current_event: state.all.find(item => item._id === action.id)
      });
    default:
      return state;
  }
}
