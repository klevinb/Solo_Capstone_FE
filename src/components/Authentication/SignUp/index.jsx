import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './SignUp.module.scss';

export default function SignUp() {
  const [name, setName] = useState('');

  const checkInputs = (e) => {
    console.log(e.target.value, e.target.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('HERE');
  };

  return (
    <div className={styles.Container}>
      <div className={styles.SignUp}>
        <h3>Register</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter email'
            />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              onChange={checkInputs}
              placeholder='Password'
            />
          </Form.Group>
          <Form.Group controlId='formBasicCheckbox'>
            <Form.Check
              type='checkbox'
              onChange={checkInputs}
              label='Check me out'
            />
          </Form.Group>
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
