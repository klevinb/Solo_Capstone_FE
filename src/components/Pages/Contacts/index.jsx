import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button, Toast } from 'react-bootstrap';
import styles from './Contacts.module.scss';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const mapStateToProps = (state) => state;
const url = process.env.REACT_APP_BE_ENDPOINT;

const Contacts = (props) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSuranme] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((name.length > 3, surname.length > 3, email, question.length > 10)) {
      const reqBody = {
        name,
        surname,
        email,
        question,
      };
      const resp = await fetch(url + '/api/users/send/question', {
        method: 'POST',
        body: JSON.stringify(reqBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (resp.ok) {
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 5000);
        setName('');
        setSuranme('');
        setEmail('');
        setQuestion('');
      }
    }
  };
  return (
    <>
      <div className={styles.Contacts}>
        <Row className={styles.Row}>
          <Col sm={12} className={styles.Col}>
            <h3>Can we help you with something?</h3>
          </Col>
          <Col sm={6} md={6} className={styles.IconCol}>
            <FaEnvelopeOpenText />
          </Col>
          <Col sm={6} md={6} className={styles.InfoCol}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='name'>
                <Form.Control
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='First Name'
                />
              </Form.Group>

              <Form.Group controlId='surname'>
                <Form.Control
                  type='text'
                  value={surname}
                  onChange={(e) => setSuranme(e.target.value)}
                  placeholder='Last Name'
                />
              </Form.Group>
              <Form.Group controlId='email'>
                <Form.Control
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="What's your email?"
                />
              </Form.Group>
              <Form.Group controlId='question'>
                <Form.Control
                  type='textarea'
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What's your question?"
                />
              </Form.Group>

              <Button variant='primary' type='submit'>
                Send Message
              </Button>
            </Form>
          </Col>
        </Row>
        <Toast
          show={show}
          onClose={() => setShow(!show)}
          className={styles.Toast}
        >
          <Toast.Header>
            <img
              src='holder.js/20x20?text=%20'
              className='rounded mr-2'
              alt=''
            />
            <strong className='mr-auto'>YOLO Team</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>
            Thank you for contacting us! For more information check your email!
          </Toast.Body>
        </Toast>
      </div>
    </>
  );
};

export default connect(mapStateToProps, null)(Contacts);
