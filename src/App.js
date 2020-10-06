import React, { useEffect } from 'react';
import { SignIn, SignUp, Nav, Main, Posts } from './components';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';
import { connect } from 'react-redux';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch, props) => ({
  setActiveUsers: (users) =>
    dispatch({
      type: 'SET_ACTIVE_USERS',
      payload: users,
    }),
  saveMsg: (msgs) =>
    dispatch({
      type: 'SET_MESSAGES',
      payload: msgs,
    }),
});

const url = process.env.REACT_APP_BE_ENDPOINT;

function App(props) {
  useEffect(() => {
    var socket;
    const connectionOpt = {
      transports: ['websocket'],
    };
    socket = io(url, connectionOpt);
    socket.on('online', (data) => {
      props.setActiveUsers(data);
    });
    socket.on('message', (msg) => {
      console.log(msg);
    });
    if (props.user !== null) {
      console.log(props.user.username);
      socket.emit('setUsername', {
        username: props.user.username,
      });
    }
  }, [props.user]);

  return (
    <Router>
      <div className='App'>
        <Nav />
        <Route path='/' exact component={Main} />
        <Route path='/posts' exact component={Posts} />
        <Route path='/login' exact component={SignIn} />
        <Route path='/register' exact component={SignUp} />
      </div>
    </Router>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
