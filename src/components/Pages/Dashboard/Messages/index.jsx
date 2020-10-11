import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './Messages.module.scss';
import { Image, Badge, Popover, OverlayTrigger } from 'react-bootstrap';
import { FcInfo } from 'react-icons/fc';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BiSend } from 'react-icons/bi';

const mapStateToProps = (state) => state;

const Messages = (props) => {
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState('');

  const popover = (
    <Popover id='popover-positioned-left'>
      <Popover.Title as='h3'>Important Info</Popover.Title>
      <Popover.Content>
        You are not following {selected && selected.name}, if you want to keep
        the conversation on your profile and talk to them later just click the
        {'  '}
        <button onClick={() => props.followUser(selected)}>Follow</button>{' '}
        button.
      </Popover.Content>
    </Popover>
  );

  return (
    <div className={styles.Container}>
      <div className={styles.ActiveUsers}>
        {props.user &&
          props.user.following.map((user, key) => (
            <div
              key={key}
              className={styles.User}
              onClick={() => {
                if (selected === user) {
                  setSelected(null);
                } else {
                  setSelected(user);
                }
              }}
            >
              <Image
                src={
                  user.image
                    ? user.image
                    : 'https://via.placeholder.com/300x200'
                }
              />
              <p>
                {user.name} {user.surname}
              </p>
              {user.messages.find(
                (message) => message.username === props.user.username
              ) &&
                user.messages.find(
                  (message) => message.username === props.user.username
                ).count > 0 && (
                  <Badge variant='light' className={styles.Notification}>
                    {
                      user.messages.find(
                        (message) => message.username === props.user.username
                      ).count
                    }
                  </Badge>
                )}
            </div>
          ))}
      </div>
      {selected && (
        <div className={styles.ChatBox}>
          <div className={styles.ChatHead}>
            <span>{selected.name}</span>
            <div className={styles.InfoIcon}>
              <AiFillCloseCircle onClick={() => setSelected(null)} />
              {/* {selected.ifollow === false && (
                <OverlayTrigger
                  trigger='click'
                  placement='left'
                  overlay={popover}
                >
                  <FcInfo />
                </OverlayTrigger>
              )} */}
            </div>
          </div>
          <div className={styles.Messages}>
            <ul id='messages' style={{ listStyle: 'none' }}>
              {props.messages.map((msg, key) => (
                <>
                  {props.user.username === msg.from &&
                  msg.to === selected.username ? (
                    <li key={key} className={styles.MyMsg}>
                      <div className={styles.MsgTitle}>
                        <Image src={selected.image} />
                        <span>{selected.name}</span>
                      </div>
                      <span>{msg.text}</span>
                    </li>
                  ) : (
                    props.user.username === msg.to &&
                    msg.from === selected.username && (
                      <li key={key} className={styles.OtherMsg}>
                        <div className={styles.MsgTitle}>
                          <Image src={props.user.image} />
                          <span>{props.user.name}</span>
                        </div>
                        <span>{msg.text} </span>
                      </li>
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
              // disabled={selected.ifollow === false ? true : false}
              onMouseDown={() => {
                props.clearMsgCount(selected.username, props.user.username);
              }}
            />
            <button
              onClick={() => {
                props.sendMsg(selected.username, props.user.username, text);
                setText('');
              }}
            >
              <BiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, null)(Messages);
