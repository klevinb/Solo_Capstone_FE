import React, { useState, useEffect } from 'react';
import Home from '../Home';
import { connect } from 'react-redux';
import { ListGroup, Row, Col, Image } from 'react-bootstrap';
import styles from './Dashboard.module.scss';
import Settings from './Settings';
import Events from './Events';
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
  incMsgCount: (user) =>
    dispatch({
      type: 'INC_MSG_COUNT',
      payload: user,
    }),
  refreshTokens: (history) => dispatch(refreshTokens(history)),
});

class Dashboard extends React.Component {
  socket = null;

  state = {
    show: true,
    selected: 'Events',
  };

  fetchUnreadMessages = async () => {
    const unReadMessages = await fetch(url + '/api/messages/me', {
      credentials: 'include',
    });
    if (unReadMessages.ok) {
      const data = await unReadMessages.json();
      data.forEach((user) =>
        this.props.addUnknownUser({ ...user, ifollow: false })
      );
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

  fetchUser = async () => {
    this.setState({ show: false });
    const resp = await fetch(url + '/api/users/me', {
      credentials: 'include',
    });

    const users = await fetch(url + '/api/users/', {
      credentials: 'include',
    });

    this.fetchMessages();
    this.fetchUnreadMessages();

    if (resp.ok) {
      const data = await resp.json();
      this.props.setUser(data);
      localStorage.setItem('loggedIn', true);

      if (users.ok) {
        const data = await users.json();
        this.props.setAllUsers(data);
      }
    }
    if (resp.status === 401) {
      this.props.refreshTokens(this.props.history);
    }
  };

  componentDidMount() {
    if (localStorage.getItem('loggedIn')) {
      this.fetchUser();
    }

    const connectionOpt = {
      transports: ['websocket'],
    };
    this.socket = io(url, connectionOpt);
    this.socket.on('online', (data) => {
      this.props.setActiveUsers(data);
    });
    this.socket.on('clearMsgCount', () => {
      this.fetchUser();
    });
    this.socket.on('message', (msg) => {
      const findUser = this.props.user.following.find(
        (user) => user.username === msg.from
      );
      if (findUser) {
        this.fetchMessages();
        this.porps.incMsgCount();
      } else {
        const user = this.props.users.find(
          (user) => user.username === msg.from
        );
        console.log('user', user);
        if (user._id !== this.porps.user._id) {
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
          <div className={styles.Dashboard}>
            <Row className={styles.Row}>
              <Col sm={12} lg={6}>
                <Row className={styles.Details}>
                  <Col sm={12} lg={12} className={styles.Col}>
                    <Image
                      src={
                        this.props.user.image
                          ? this.props.user.image
                          : 'https://via.placeholder.com/300x200'
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
                        onClick={() => this.setState({ selected: 'Messages' })}
                      >
                        Messages
                      </ListGroup.Item>
                      <ListGroup.Item
                        className={
                          this.state.selected === 'Settings'
                            ? `${styles.ListItem} ${styles.Selected}`
                            : styles.ListItem
                        }
                        onClick={() => this.setState({ selected: 'Settings' })}
                      >
                        Settings
                      </ListGroup.Item>
                    </ListGroup>
                  </Row>
                </Row>
              </Col>
              <Col sm={12} lg={6}>
                {this.state.selected === 'Settings' && (
                  <Settings user={this.props.user} fetchUser={this.fetchUser} />
                )}
                {this.state.selected === 'Events' && (
                  <Events events={this.props.user.events} />
                )}
                {this.state.selected === 'Messages' && (
                  <Messages
                    sendMsg={this.sendMsg}
                    clearMsgCount={this.clearMsgCount}
                  />
                )}
              </Col>
            </Row>
          </div>
        )}

        {this.state.show && <Home />}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
