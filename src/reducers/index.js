export default function (state = [], action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        loggedIn: true,
        user: action.payload,
      };
    case 'SET_ACTIVE_USERS':
      return {
        ...state,
        activeUsers: action.payload,
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
            (user) => user._id === action.payload._id
          )
            ? state.user.following.filter(
                (user) => user._id !== action.payload._id
              )
            : [...state.user.following, { ...action.payload }],
        },
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'LOCAL_MSG':
      return {
        ...state,
        messages: state.messages.concat(action.payload),
      };
    case 'UNKNOWN_USER':
      return {
        ...state,
        user: {
          ...state.user,
          following: [...state.user.following, { ...action.payload }],
        },
      };
    case 'SET_ALL_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'CLEAR_STATE':
      return {
        loggedIn: false,
        user: null,
        activeUsers: [],
        messages: [],
        users: [],
      };
    default:
      return state;
  }
}
