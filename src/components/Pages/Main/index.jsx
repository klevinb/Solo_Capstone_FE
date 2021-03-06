import React, { useEffect, useState } from 'react';
import styles from './Main.module.scss';
import Contacts from '../Contacts';
import About from '../About';
import Home from '../Home';

import { connect } from 'react-redux';

const mapStateToProps = (state) => state;

const Main = (props) => {
  return (
    <>
      <div className={styles.Home} id='home'>
        <Home />
      </div>
      <div className={styles.About} id='about'>
        <About />
      </div>
      <div className={`${styles.Container} ${styles.Contacts}`} id='contacts'>
        <Contacts />
      </div>
    </>
  );
};

export default connect(mapStateToProps, null)(Main);
