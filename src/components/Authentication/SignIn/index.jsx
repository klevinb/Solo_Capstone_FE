import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './SignIn.module.scss';
import { connect } from 'react-redux';
import { FaFacebook } from 'react-icons/fa';

const mapStateToProps = (state) => state;

const url = process.env.REACT_APP_BE_ENDPOINT;

function Login(props) {
  const [credentials, setCredentials] = useState('');
  const [password, setPassword] = useState('');
  const [error, showError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const login = async () => {
    const resp = await fetch(url + '/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ credentials, password }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (resp.ok) {
      localStorage.setItem('loggedIn', true);
      props.history.push('/profile');
    } else {
      setErrorMessage('Credentials are incorrect!');
      showError(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.length > 3 && password.length >= 3) {
      login();
    } else {
      setErrorMessage('Please fill the fields!');
      showError(true);
    }
  };

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.BG}></div>
        <div className={styles.Login}>
          <div className={styles.Options}>
            <h3>Login or</h3>
            <button>
              <a href={url + '/api/users/auth/facebook'}>
                Continue with <FaFacebook />
              </a>
            </button>
          </div>
          {error && <Alert variant='danger'>{errorMessage}</Alert>}
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
        </div>
      </div>
    </>
  );
}

export default connect(mapStateToProps)(Login);
