export const logoutThunk = (id) => {
  return (dispatch, getState) => {
    fetch(process.env.REACT_APP_BE_ENDPOINT + '/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(() =>
        dispatch({
          type: 'LOGOUT',
        })
      )
      .catch((e) => console.log(e));
  };
};

export const refreshTokens = (history) => {
  return (dispatch, getState) => {
    const refreshAsync = async () => {
      const resp = await fetch(
        process.env.REACT_APP_BE_ENDPOINT + '/api/users/refreshTokens',
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (resp.status === 200) {
        history.push('/');
      }
      if (resp.status === 401) {
        localStorage.removeItem('loggedIn');
        history.push('/login');
      }
    };
    refreshAsync();
  };
};
