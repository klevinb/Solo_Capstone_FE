export default function (state = [], action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'PUT_LOGIN_ACTIVE':
      return {
        ...state,
        loggedIn: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false,
      };

    default:
      return state;
  }
}
