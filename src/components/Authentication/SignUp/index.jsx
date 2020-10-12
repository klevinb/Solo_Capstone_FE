import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './SignUp.module.scss';

const url = process.env.REACT_APP_BE_ENDPOINT;

export default function SignUp(props) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState(18);
  const [birthday, setBirthday] = useState(undefined);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPass, setVerifyPass] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const triggerError = (msg) => {
    setError(true);
    setErrorMsg(msg);
    setTimeout(() => {
      setError(false);
      setErrorMsg('');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== verifyPass) {
      triggerError('Passwords need to e equal!');
    }
    if (name && surname && age && birthday && username && email && password) {
      const register = await fetch(url + '/api/users/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          surname,
          age,
          birthday,
          username,
          email,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (register.ok) {
        props.history.push('/login');
      }
    } else {
      triggerError(
        'You need to fill up all the fields to be able to register!'
      );
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.BG}></div>
      <div className={styles.SignUp}>
        <h3>Register</h3>
        {error && (
          <Alert variant='warning' className={styles.ErrorMessage}>
            {errorMsg}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={6} md={6}>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Name ...'
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group controlId='surname'>
                <Form.Label>Suranme</Form.Label>
                <Form.Control
                  type='text'
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder='Surname ...'
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group controlId='age'>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type='number'
                  min='18'
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group controlId='birthday'>
                <Form.Label>Birthday</Form.Label>
                <Form.Control
                  type='date'
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group controlId='username'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Username ...'
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='exmp@gmail.com'
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='***********'
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group controlId='verifyPass'>
                <Form.Label>Verify Password</Form.Label>
                <Form.Control
                  type='password'
                  value={verifyPass}
                  onChange={(e) => setVerifyPass(e.target.value)}
                  placeholder='***********'
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant='primary' type='submit'>
            Register
          </Button>
        </Form>
        <span>
          Already have an account? <Link to='/login'>Login</Link>
        </span>
      </div>
    </div>
  );
}
