import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({ token: null, roles: [''], user: null ,isSessionActive:false});

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      state=state.set('user', action.user.user);
      state=state.set('isSessionActive',true);
      return state;
    case actions.STORE_TOKEN:
      return state.set('token', action.token.token);
    case actions.CHECK_ROLES:
      return state.set('roles', action.data);
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}
