import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col } from 'react-bootstrap';
import styles from './Events.module.scss';
import Pulse from 'react-reveal/Pulse';
import { FaCcPaypal } from 'react-icons/fa';

const mapStateToProps = (state) => state;
const url = process.env.REACT_APP_BE_ENDPOINT;

const Events = (props) => {
  const [events, setEvents] = useState([]);

  const buyEvent = async (eventId) => {
    if (props.loggedIn) {
      const resp = await fetch(url + '/api/events/buyEvent/' + eventId, {
        method: 'POST',
        credentials: 'include',
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }),
      });
      const redirectUrl = await resp.json();
      if (resp.ok) {
        window.location.replace(redirectUrl);
      }
    } else {
      alert('Please login to buy an Event');
    }
  };

  const fetchEvents = async () => {
    const resp = await fetch(
      url + `/api/events${props.loggedIn === true ? '' : '/notUser'}`,
      {
        credentials: 'include',
      }
    );

    if (resp.ok) {
      const data = await resp.json();

      setEvents(data);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [props.user]);

  return (
    <>
      <div className={styles.Container}>
        <h3>Latest Events</h3>
        <Row className='row-cols-2'>
          {events.map((event, key) => (
            <Col key={key} sm={6} lg={4} className={styles.Col}>
              <Pulse>
                <Card className={styles.Card}>
                  <Card.Img
                    variant='top'
                    src={
                      event.image[0]
                        ? event.image[0]
                        : 'https://via.placeholder.com/300x200'
                    }
                  />
                  <Card.Body className={styles.CardBody}>
                    <Card.Title>{event.name}</Card.Title>
                    <Card.Text>{event.description}</Card.Text>
                    <Card.Text>
                      <span className={styles.Bold}>Organizer </span>
                      {event.organizer}
                    </Card.Text>
                    {event.performer && (
                      <Card.Text>
                        <span className={styles.Bold}>Performer </span>
                        {event.performer}
                      </Card.Text>
                    )}
                    <Card.Text>
                      <span className={styles.Bold}>Date </span>
                      {event.startDate.slice(0, 10)} 21:30
                    </Card.Text>

                    <button onClick={() => buyEvent(event._id)}>
                      <FaCcPaypal />
                      {`$${event.price}`}
                    </button>
                  </Card.Body>
                </Card>
              </Pulse>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default connect(mapStateToProps, null)(Events);
