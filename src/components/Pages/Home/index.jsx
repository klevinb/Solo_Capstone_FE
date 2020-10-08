import React from 'react';
import Tada from 'react-reveal/Tada';
import styles from './Home.module.scss';

export default () => (
  <>
    <div className={styles.Container}>
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
  </>
);
