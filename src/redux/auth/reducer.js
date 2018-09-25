import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({ token: null, roles: ['admin'], user: null });

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      if (action.user.user !== null) {
        return state.set('user', action.user.user);
      } else {
        return state.set('user', action.user.user);
      }
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
