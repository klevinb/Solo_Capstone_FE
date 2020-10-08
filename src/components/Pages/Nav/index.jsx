import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.scss';
import { Image, Dropdown } from 'react-bootstrap';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutThunk } from '../../../Utilities';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch, props) => ({
  logout: () => dispatch(logoutThunk()),
  clearState: () => dispatch({ type: 'CLEAR_STATE' }),
});

const Nav = (props) => {
  const [show, setShow] = useState(true);

  useEffect(() => {}, [props.user]);

  return (
    <>
      <div className={styles.Nav}>
        <Link to='/'>
          <Image src='./assets/YOLO.png' />
        </Link>

        <MenuIcon
          className={styles.NavToggler}
          onClick={() => setShow(!show)}
        />
        <div
          className={
            show ? `${styles.NavLinks}` : `${(styles.NavLinks, styles.Show)}`
          }
        >
          <ol>
            {props.location.pathname !== '/login' &&
              props.location.pathname !== '/register' && (
                <>
                  {props.loggedIn ? (
                    <>
                      <li
                        onClick={() => {
                          setShow(!show);
                          props.history.push('/posts');
                        }}
                      >
                        <a href='#'>Posts</a>
                      </li>
                      <li
                        onClick={() => {
                          setShow(!show);
                          props.history.push('/#home');
                        }}
                      >
                        <a href='#home'>Profile</a>
                      </li>
                    </>
                  ) : (
                    <li
                      onClick={() => {
                        setShow(!show);
                        props.history.push('/#home');
                      }}
                    >
                      <a href='#home'>Home</a>
                    </li>
                  )}
                  <li
                    onClick={() => {
                      setShow(!show);
                      props.history.push('/#events');
                    }}
                  >
                    <a href='#events'>Events</a>
                  </li>
                </>
              )}
            {props.loggedIn ? (
              <li className={styles.UserInfo}>
                <Dropdown>
                  <Dropdown.Toggle variant='transparent' id='dropdown-basic'>
                    <Image
                      src={
                        props.user && props.user.image
                          ? props.user.image
                          : 'https://via.placeholder.com/300x200'
                      }
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      href='#contacts'
                      onClick={() => {
                        props.history.push('/#contacts');
                        setShow(!show);
                      }}
                    >
                      Contacts
                    </Dropdown.Item>

                    <Dropdown.Item
                      className={styles.Logout}
                      onClick={() => {
                        localStorage.removeItem('loggedIn');
                        props.clearState();
                        props.logout();
                        props.history.push('/#contacts');

                        setShow(!show);
                      }}
                    >
                      Log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            ) : (
              <li onClick={() => setShow(!show)}>
                <Link to='/login'>Login</Link>
              </li>
            )}
          </ol>
        </div>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav));
