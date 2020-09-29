import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './SignIn.module.scss';

const url = process.env.REACT_APP_BE_ENDPOINT;

export default function Login() {
  const [credentials, setCredentials] = useState('');
  const [password, setPassword] = useState('');

  const payButton = async () => {
    const resp = await fetch(
      url + '/api/events/buyEvent/5f6dc25f728c751254799a09',
      {
        method: 'POST',
        credentials: 'include',
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }),
      }
    );
    const redirectUrl = await resp.json();
    if (resp.ok) {
      window.location = redirectUrl;
    }
  };

  const login = async () => {
    const resp = await fetch(url + '/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ credentials, password }),
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    console.log(resp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.length > 3 && password.length >= 3) {
      login();
    }
  };

  return (
    <div className={styles.Login}>
      <h3>Login</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='credentials'>
          <Form.Label>Email / Username</Form.Label>
          <Form.Control
            type='text'
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            placeholder='. . .'
          />
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='. . .'
          />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
      <span>
        Dont have an account? <Link to='/register'>Register</Link>
      </span>
      <button onClick={payButton}>PAY</button>
    </div>
  );
}
