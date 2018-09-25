const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  CHECK_ROLES: 'CHECK_ROLES',
  STORE_TOKEN: 'STORE_TOKEN',

  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),

  checkRoles: data => ({
    type: actions.CHECK_ROLES,
    data
  }),

  login: user => ({
    type: actions.LOGIN_SUCCESS,
    user
  }),

  storeToken: token => ({
    type: actions.STORE_TOKEN,
    token
  }),

  logout: () => ({
    type: actions.LOGOUT
  })

};

export default actions;
