import React from 'react';
import styles from './Events.module.scss';

export default ({ events }) => (
  <div className={styles.Container}>{events.map((event) => event.name)}</div>
);
