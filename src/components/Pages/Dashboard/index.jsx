import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ListGroup, Row, Col, Image } from 'react-bootstrap';
import styles from './Dashboard.module.scss';
import Settings from './Settings';
import UserEvents from './UserEvents';
import Events from '../Events';
import Messages from './Messages';
import { refreshTokens } from '../../../Utilities';
import io from 'socket.io-client';

const url = process.env.REACT_APP_BE_ENDPOINT;
const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch, props) => ({
  setUser: (user) =>
    dispatch({
      type: 'SET_USER',
      payload: user,
    }),
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
  saveNewMsg: (msg) =>
    dispatch({
      type: 'LOCAL_MSG',
      payload: msg,
    }),
  addUnknownUser: (user) =>
    dispatch({
      type: 'UNKNOWN_USER',
      payload: user,
    }),
  setAllUsers: (users) =>
    dispatch({
      type: 'SET_ALL_USERS',
      payload: users,
    }),
  follow: (user) =>
    dispatch({
      type: 'FOLLOW_USER',
      payload: user,
    }),
  refreshTokens: (history) => dispatch(refreshTokens(history)),
});

class Dashboard extends React.Component {
  socket = null;

  state = {
    show: null,
    selected: 'Events',
  };

  fetchUnreadMessages = async () => {
    const unReadMessages = await fetch(url + '/api/messages/me', {
      credentials: 'include',
    });
    if (unReadMessages.ok) {
      const data = await unReadMessages.json();
      data.forEach((user) => {
        const iFollow = this.props.user.following.find(
          (usr) => usr.username === user.username
        );
        if (!iFollow) {
          this.props.addUnknownUser({ ...user });
        }
      });
    }
  };

  fetchMessages = async () => {
    const messages = await fetch(url + '/api/messages', {
      credentials: 'include',
    });

    if (messages.ok) {
      const data = await messages.json();
      this.props.saveMsg(data);
    } else if (messages.status === 401) {
      this.props.refreshTokens(this.props.history);
    }
  };

  fetchAllUsers = async () => {
    const users = await fetch(url + '/api/users/', {
      credentials: 'include',
    });

    if (users.ok) {
      const data = await users.json();
      this.props.setAllUsers(data);
    }
  };

  followUser = async (user) => {
    const resp = await fetch(
      url +
        '/api/users/' +
        this.props.user.username +
        '/follow/' +
        user.username,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (resp.ok) {
      this.props.follow(user);
    } else if (resp.status === 401) {
      this.props.refreshTokens(this.props.history);
    }
  };

  fetchUser = async () => {
    this.setState({ show: false });
    const resp = await fetch(url + '/api/users/me', {
      credentials: 'include',
    });

    if (resp.ok) {
      const data = await resp.json();
      this.props.setUser(data);
      localStorage.setItem('loggedIn', true);
      this.fetchMessages();
      this.fetchUnreadMessages();
      this.fetchAllUsers();
      console.log(this.props.user.events);
    }
    if (resp.status === 401) {
      this.props.refreshTokens(this.props.history);
    }
    if (resp.status === 400) {
      this.props.history.push('/login');
    }
  };

  componentDidMount() {
    // if (!localStorage.getItem('loggedIn')) {
    //   this.props.history.push('/login');
    // } else {
    this.fetchUser();
    // }

    const connectionOpt = {
      transports: ['websocket'],
    };
    this.socket = io(url, connectionOpt);
    this.socket.on('online', (data) => {
      this.props.setActiveUsers(data);
    });
    this.socket.on('clearMsgCount', () => {
      this.fetchAllUsers();
      this.fetchUser();
    });
    this.socket.on('message', (msg) => {
      const findUser = this.props.user.following.find(
        (user) => user.username === msg.from
      );
      if (findUser) {
        this.fetchMessages();
        this.fetchAllUsers();
        this.fetchUser();
      } else {
        const user = this.props.users.find(
          (user) => user.username === msg.from
        );

        if (user._id !== this.props.user._id) {
          this.props.addUnknownUser({ ...user, ifollow: false });
          this.fetchMessages();
        }
      }
    });
    this.setUsername();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.loggedIn !== this.props.loggedIn) {
      this.setState({ show: !this.props.loggedIn });
    }
    if (prevProps.user !== this.props.user) {
      this.setUsername();
    }
  };

  setUsername = () => {
    if (this.props.user !== null) {
      this.socket.emit('setUsername', {
        username: this.props.user.username,
      });
    }
  };

  sendMsg = (to, from, message) => {
    if (message.length > 0) {
      this.socket.emit('sendMessage', {
        to: to,
        from: from,
        text: message,
      });
      this.props.saveNewMsg({ to, from, text: message });
    }
  };

  clearMsgCount = (username, refUser) => {
    console.log(username, refUser);
    this.socket.emit('clearMsgCount', {
      username,
      refUser,
    });
  };

  render() {
    return (
      <>
        {this.props.user && (
          <>
            <div className={styles.Dashboard} id='home'>
              <Row className={styles.Row}>
                <Col sm={12} lg={6}>
                  <Row className={styles.Details}>
                    <Col sm={12} lg={12} className={styles.Col}>
                      <Image
                        src={
                          this.props.user.image
                            ? this.props.user.image
                            : 'https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png'
                        }
                        alt='user img'
                      />
                    </Col>
                    <Col sm={12} lg={12} className={styles.Col}>
                      <p>{`${this.props.user.name} ${this.props.user.surname}`}</p>
                    </Col>
                    <Row className={styles.Menu}>
                      <ListGroup className={styles.ListGroup}>
                        <ListGroup.Item
                          className={
                            this.state.selected === 'Events'
                              ? `${styles.ListItem} ${styles.Selected}`
                              : styles.ListItem
                          }
                          onClick={() => this.setState({ selected: 'Events' })}
                        >
                          Events
                        </ListGroup.Item>
                        <ListGroup.Item
                          className={
                            this.state.selected === 'Messages'
                              ? `${styles.ListItem} ${styles.Selected}`
                              : styles.ListItem
                          }
                          onClick={() =>
                            this.setState({ selected: 'Messages' })
                          }
                        >
                          Messages
                        </ListGroup.Item>
                        <ListGroup.Item
                          className={
                            this.state.selected === 'Settings'
                              ? `${styles.ListItem} ${styles.Selected}`
                              : styles.ListItem
                          }
                          onClick={() =>
                            this.setState({ selected: 'Settings' })
                          }
                        >
                          Settings
                        </ListGroup.Item>
                      </ListGroup>
                    </Row>
                  </Row>
                </Col>
                <Col sm={12} lg={6}>
                  {this.state.selected === 'Settings' && (
                    <Settings
                      user={this.props.user}
                      fetchUser={this.fetchUser}
                    />
                  )}
                  {this.state.selected === 'Events' && (
                    <UserEvents followUser={this.followUser} />
                  )}
                  {this.state.selected === 'Messages' && (
                    <Messages
                      sendMsg={this.sendMsg}
                      clearMsgCount={this.clearMsgCount}
                      followUser={this.followUser}
                    />
                  )}
                </Col>
              </Row>
            </div>
            <div className={`${styles.Container} ${styles.Events}`} id='events'>
              <Events />
            </div>
          </>
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
