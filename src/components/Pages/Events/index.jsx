import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col } from 'react-bootstrap';
import styles from './Events.module.scss';

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
        window.location = redirectUrl;
      }
    } else {
      alert('Please login to buy an Event');
    }
  };

  useEffect(() => {
    if (props.loggedIn) {
      const fetchEvents = async () => {
        const resp = await fetch(url + '/api/events', {
          credentials: 'include',
        });
        console.log(resp);
        if (resp.ok) {
          const data = await resp.json();
          console.log(data);
          setEvents(data);
        }
      };
      fetchEvents();
    } else {
      const fetchEvents = async () => {
        const resp = await fetch(url + '/api/events/notUser');
        console.log(resp);
        if (resp.ok) {
          const data = await resp.json();
          console.log(data);
          setEvents(data);
        }
      };
      fetchEvents();
    }
  }, []);

  return (
    <>
      <div className={styles.Container}>
        <Row className='row-cols-2'>
          {console.log(props)}
          {events.map((event, key) => (
            <Col key={key} sm={6} lg={4}>
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

                  <button
                    onClick={() => buyEvent(event._id)}
                  >{`Buy Ticket $${event.price}`}</button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default connect(mapStateToProps, null)(Events);
