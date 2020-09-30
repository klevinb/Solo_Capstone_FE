import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.scss';
import { Image } from 'react-bootstrap';
import MenuIcon from '@material-ui/icons/Menu';

const Nav = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className={styles.Nav}>
        <Link to='/'>
          <Image src='assets/YOLO.png' />
        </Link>

        <MenuIcon
          className={styles.NavToggler}
          onClick={() => setShow(!show)}
        />
        <div
          className={
            show ? `${(styles.NavLinks, styles.Show)}` : `${styles.NavLinks}`
          }
        >
          <ol onClick={() => setShow(!show)}>
            <li>
              <a href='#home'>Home</a>
            </li>
            <li>
              <a href='#events'>Events</a>
            </li>
            <li>
              <a href='#events'>Contacts</a>
            </li>
            <li>
              <Link to='/login'>Login</Link>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default Nav;
