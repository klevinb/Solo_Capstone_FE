import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import styles from './Contacts.module.scss';

const mapStateToProps = (state) => state;
const url = process.env.REACT_APP_BE_ENDPOINT;

const Contacts = (props) => {
  const [events, setEvents] = useState([]);

  return (
    <>
      <div className={styles.Contacts}>
        <Row className='row-cols-2'>
          {events.map((event, key) => (
            <Col key={key} sm={6} lg={4}></Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default connect(mapStateToProps, null)(Contacts);
