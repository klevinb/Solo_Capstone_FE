import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.scss';
import { Image, Dropdown } from 'react-bootstrap';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutThunk } from '../../../Utilities';
import { join } from 'path';

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
      <div className={styles.Container}>
        <div className={styles.Nav}>
          <Link to={props.user ? '/profile' : '/'}>
            <Image src='/assets/yolo.png' />
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
                        props.history.push('/profile');
                      }}
                    >
                      <a href='#home'>Profile</a>
                    </li>
                    <li
                      onClick={() => {
                        setShow(!show);
                      }}
                    >
                      <a href='#events'>Events</a>
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      onClick={() => {
                        setShow(!show);
                        props.history.push('/');
                      }}
                    >
                      <a href='#home'>Home</a>
                    </li>
                    <li
                      onClick={() => {
                        setShow(!show);
                        props.history.push('/#about');
                      }}
                    >
                      <a href='#about'>About</a>
                    </li>
                  </>
                )}
              </>

              {props.loggedIn ? (
                <li className={styles.UserInfo}>
                  <Dropdown>
                    <Dropdown.Toggle variant='transparent' id='dropdown-basic'>
                      <Image
                        src={
                          props.user && props.user.image
                            ? props.user.image
                            : 'https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png'
                        }
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        href='#contacts'
                        className={styles.DropdownMenu}
                        onClick={() => {
                          props.history.push('/#contacts');
                          setShow(!show);
                        }}
                      >
                        Contacts
                      </Dropdown.Item>

                      <Dropdown.Item
                        className={styles.DropdownMenu}
                        onClick={() => {
                          localStorage.removeItem('loggedIn');
                          props.clearState();
                          props.logout();
                          props.history.push('/#home');
                          setShow(!show);
                        }}
                      >
                        Log out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              ) : (
                <>
                  <li
                    onClick={() => {
                      setShow(!show);
                      props.history.push('/#contacts');
                    }}
                  >
                    <a href='#contacts'>Contacts</a>
                  </li>
                  <li onClick={() => setShow(!show)}>
                    <Link to='/register'>Register</Link>
                  </li>
                </>
              )}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav));
