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
  setLoggedIn: () =>
    dispatch({
      type: 'PUT_LOGIN_ACTIVE',
    }),
  refreshTokens: (history) => dispatch(refreshTokens(history)),
});

const Dashboard = (props) => {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState('Settings');
  let socket = null;
  const fetchUser = async () => {
    const resp = await fetch(url + '/api/users/me', {
      credentials: 'include',
    });

    if (resp.ok) {
      const data = await resp.json();
      props.setUser(data);
      props.setLoggedIn();
      localStorage.setItem('loggedIn', true);
    }
    if (resp.status === 401) {
      console.log('401', props.history);
      props.refreshTokens(props.history);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('loggedIn')) {
      fetchUser();
    }
    setShow(!props.loggedIn);
    const connectionOpt = {
      transports: ['websocket'],
    };
    socket = io(url, connectionOpt);
    socket.on('online', (data) => {
      console.log(data);
    });
    socket.on('message', (msg) => {
      console.log(msg);
    });
    if (props.user) {
      socket.emit('setUsername', {
        username: props.user.username,
      });
    }
  }, [props.loggedIn]);

  return (
    <>
      {localStorage.getItem('loggedIn') && props.user && (
        <div className={styles.Dashboard}>
          <Row className={styles.Row}>
            <Col sm={12} lg={6}>
              <Row className={styles.Details}>
                <Col sm={12} lg={12} className={styles.Col}>
                  <Image
                    src={
                      props.user.image
                        ? props.user.image
                        : 'https://via.placeholder.com/300x200'
                    }
                    alt='user img'
                  />
                </Col>
                <Col sm={12} lg={12} className={styles.Col}>
                  <p>{`${props.user.name} ${props.user.surname}`}</p>
                </Col>
                <Row className={styles.Menu}>
                  <ListGroup className={styles.ListGroup}>
                    <ListGroup.Item
                      className={
                        selected === 'Events'
                          ? `${styles.ListItem} ${styles.Selected}`
                          : styles.ListItem
                      }
                      onClick={() => setSelected('Events')}
                    >
                      Events
                    </ListGroup.Item>
                    <ListGroup.Item
                      className={
                        selected === 'Messages'
                          ? `${styles.ListItem} ${styles.Selected}`
                          : styles.ListItem
                      }
                      onClick={() => setSelected('Messages')}
                    >
                      Messages
                    </ListGroup.Item>
                    <ListGroup.Item
                      className={
                        selected === 'Settings'
                          ? `${styles.ListItem} ${styles.Selected}`
                          : styles.ListItem
                      }
                      onClick={() => setSelected('Settings')}
                    >
                      Settings
                    </ListGroup.Item>
                  </ListGroup>
                </Row>
              </Row>
            </Col>
            <Col sm={12} lg={6}>
              {selected === 'Settings' && (
                <Settings user={props.user} fetchUser={fetchUser} />
              )}
              {selected === 'Events' && <Events events={props.user.events} />}
              {selected === 'Messages' && <Messages />}
            </Col>
          </Row>
        </div>
      )}
      {show && <Home />}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
