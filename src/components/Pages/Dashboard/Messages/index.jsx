import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './Messages.module.scss';
import { Image } from 'react-bootstrap';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch, props) => ({
  setActiveUsers: (users) =>
    dispatch({
      type: 'SET_ACTIVE_USERS',
      payload: users,
    }),
  saveMsg: (msgs) =>
    dispatch({
      type: 'SET_MESSAGES',
      payload: msgs,
    }),
});

const Messages = (props) => {
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState('');

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
          <div className={styles.Messages}>
            <ul id='messages' style={{ listStyle: 'none' }}>
              {props.messages.map((msg, i) => (
                <>
                  {props.user.username === msg.from &&
                  msg.to === selected.username ? (
                    <li key={i} className='text-right'>
                      {msg.text}
                    </li>
                  ) : (
                    props.user.username === msg.to &&
                    msg.from === selected.username && (
                      <li key={i}>{msg.text}</li>
                    )
                  )}
                </>
              ))}
            </ul>
          </div>
          <div className={styles.Controles}>
            <input
              type='text'
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <button
              onClick={() => {
                props.sendMsg(selected.username, props.user.username, text);
                setText('');
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
