export default function (state = [], action) {
  switch (action.type) {
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload,
      };
    case 'PUT_LOGIN_ACTIVE':
      return {
        ...state,
        loggedIn: true,
      };
    default:
      return state;
  }
}
