import React, { useState } from 'react';
import styles from './UserEvents.module.scss';
import { Row, Col, Image, Modal } from 'react-bootstrap';
import { Alert, AlertTitle } from '@material-ui/lab';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import { connect } from 'react-redux';

const mapStateToProps = (state) => state;

const UserEvents = (props) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className={styles.Container}>
      {props.user.events.length > 0 ? (
        <>
          <h3>My events</h3>
          {props.user.events.map((event) => (
            <>
              <Row className={styles.Row}>
                <Col sm={3}>
                  <Image fluid src={event.image ? event.image : ''} />
                </Col>
                <Col sm={9}>
                  <h4>{event.name}</h4>
                  <p>{event.description}</p>

                  <AvatarGroup max={4}>
                    {event.participants
                      .filter((user) => user !== props.user._id)
                      .map((id) => {
                        const user = props.users.find(
                          (user) => user._id === id
                        );
                        if (user) {
                          return (
                            <Avatar
                              onClick={() => setShowModal(true)}
                              alt={user.name}
                              src={user.image}
                            />
                          );
                        }
                      })}
                  </AvatarGroup>
                </Col>
              </Row>
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Participants</Modal.Title>
                </Modal.Header>
                <div className={styles.ModalCardBody}>
                  {event.participants
                    .filter((user) => user !== props.user._id)
                    .map((id, key) => {
                      const user = props.users.find((user) => user._id === id);
                      if (user) {
                        return (
                          <Row className={styles.Participants} key={key}>
                            <Col>
                              <Avatar
                                onClick={() => setShowModal(true)}
                                alt={user.name}
                                src={user.image}
                              />
                            </Col>
                            <Col>
                              <p>
                                {user.name} {user.surname}
                              </p>
                            </Col>
                            <Col>
                              {user._id !== props.user._id && (
                                <button
                                  onClick={() => {
                                    props.followUser(user);
                                  }}
                                >
                                  {props.user &&
                                  props.user.following.find(
                                    (usr) => usr._id === user._id
                                  ) ? (
                                    <>
                                      <span>UnFollow</span>
                                      <RiUserUnfollowLine />
                                    </>
                                  ) : (
                                    <>
                                      <span>Follow</span>
                                      <RiUserFollowLine />
                                    </>
                                  )}
                                </button>
                              )}
                            </Col>
                          </Row>
                        );
                      }
                    })}
                </div>
              </Modal>
            </>
          ))}
        </>
      ) : (
        <>
          <Alert severity='info'>
            <AlertTitle>No bought events</AlertTitle>
            We have listed the latest events on Event Section.
            <strong>Check it out!</strong>
          </Alert>
        </>
      )}
    </div>
  );
};

export default connect(mapStateToProps, null)(UserEvents);
