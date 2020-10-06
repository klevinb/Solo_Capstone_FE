import React, { useEffect, useState } from 'react';
import styles from './Main.module.scss';
import Events from '../Events';
import Contacts from '../Contacts';
import Dashboard from '../Dashboard';

import { connect } from 'react-redux';

const mapStateToProps = (state) => state;

const Main = (props) => {
  return (
    <>
      <div className={styles.Home} id='home'>
        <Dashboard socket={props.socket} history={props.history} />
      </div>
      <div className={`${styles.Container} ${styles.Events}`} id='events'>
        <Events />
      </div>
      <div className={`${styles.Container} ${styles.Contacts}`} id='contacts'>
        <Contacts />
      </div>
    </>
  );
};

export default connect(mapStateToProps, null)(Main);
