import * as types from '../actions/types';

const initialState = {
  user: null,
  loginFailed: null,
  registrationFailed: null,
  registrationSuccess: null
};

// Reducer that handles all user authentication
// Note Object.assign is used to keep state immutable
function Auth(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return {
        user: action.user,
        loginFailed: false
      };
    case types.LOGIN_FAILED:
      return Object.assign({}, state, {
        loginFailed: true
      });
    case types.REGISTRATION_SUCCESS:
      return Object.assign({}, state, {
        registrationFailed: false,
        registrationSuccess: true
      });
    case types.REGISTRATION_FAILED:
      return Object.assign({}, state, {
        registrationFailed: true,
        registrationSuccess: false
      });
    case types.LOGOUT:
      return initialState;
    case types.AUTH_FAILURE_ACCEPTED:
      return Object.assign({}, state, {
        loginFailed: null,
        registrationFailed: null
      });
    default:
      return state;
  }
}

export default Auth;
