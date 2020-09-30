import React, { useState } from 'react';
import styles from './Main.module.scss';
import Tada from 'react-reveal/Tada';
import { Events } from '../../../components';

export default () => {
  return (
    <>
      <div className={styles.Home} id='home'>
        <Tada>
          <div>
            <h1>
              <span>SUPERMIX</span>
            </h1>
            <h1>ELECTRO HOUSE</h1>
            <button>
              <a href='#events'>GET TICKETS</a>
            </button>
          </div>
        </Tada>
      </div>
      <div className={styles.Events} id='events'>
        <Events />
      </div>
    </>
  );
};
