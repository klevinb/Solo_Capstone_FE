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
    case 'FOLLOW_USER':
      return {
        ...state,
        user: {
          ...state.user,
          following: state.user.following.find(
            (user) => user._id === action.payload
          )
            ? state.user.following.filter((user) => user._id !== action.payload)
            : [...state.user.following, { _id: action.payload }],
        },
      };
    default:
      return state;
  }
}
