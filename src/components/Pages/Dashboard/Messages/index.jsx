import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './Messages.module.scss';
import { Image } from 'react-bootstrap';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
  saveMsg: (msgs) =>
    dispatch({
      type: 'SET_MESSAGES',
      payload: msgs,
    }),
});

const Messages = (props) => {
  const [selected, setSelected] = useState(null);
  return (
    <div className={styles.Container}>
      <div className={styles.ActiveUsers}>
        {/* {props.activeUsers
        .filter((user) => user !== props.user.username)
        .map((user) => (
          <p>{user}</p>
        ))} */}
        {props.user.following.map((user, key) => (
          <div
            key={key}
            className={styles.User}
            onClick={() => setSelected(user)}
          >
            <Image
              src={
                user.image ? user.image : 'https://via.placeholder.com/300x200'
              }
            />
            <p>
              {user.name} {user.surname}
            </p>
          </div>
        ))}
      </div>
      {selected && (
        <div className={styles.ChatBox}>
          <div className={styles.ChatHead}>
            <span>{selected.name}</span>
          </div>
          <div className={styles.Messages}></div>
          <div className={styles.Controles}>
            <input type='text' />
            <button>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
