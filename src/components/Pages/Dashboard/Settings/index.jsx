import React, { useState, useEffect } from 'react';
import styles from './Settings.module.scss';
import { Form, Row, Col, Toast } from 'react-bootstrap';

export default (props) => {
  const [changePass, setChangePass] = useState(false);
  const [name, setName] = useState(props.user.name);
  const [surname, setSurname] = useState(props.user.surname);
  const [age, setAge] = useState(props.user.age);
  const [birthday, setBirthday] = useState(props.user.birthday);
  const [image, setImage] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [popOverMessage, setPopOverMessage] = useState('');
  const [showPopOver, setShowPopOver] = useState(false);

  const url = process.env.REACT_APP_BE_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      name,
      surname,
      age,
      birthday,
    };

    if (changePass) {
      if (!error && password.length > 2) {
        const resp = await fetch(url + '/api/users/me', {
          method: 'PUT',
          credentials: 'include',
          body: JSON.stringify({ ...user, password }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (resp.ok) {
          props.fetchUser();
        }
      } else {
        setPopOverMessage(
          'You need to add new password, or please close the passwords'
        );
        setShowPopOver(true);
      }
    } else {
      if (
        name === props.user.name &&
        surname === props.user.surname &&
        age === props.user.age &&
        birthday === props.user.birthday &&
        image === null
      ) {
        setPopOverMessage('You have to change something!');
        setShowPopOver(true);
      } else {
        const resp = await fetch(url + '/api/users/me', {
          method: 'PUT',
          credentials: 'include',
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (image !== null) {
          const photo = new FormData();
          photo.append('profile', image);

          const resp = await fetch(url + '/api/users/me/upload', {
            method: 'POST',
            credentials: 'include',
            body: photo,
          });
          if (resp.ok) {
            props.fetchUser();
          }
        }
        if (resp.ok) {
          props.fetchUser();
        }
      }
    }
  };

  const checkPassword = async () => {
    const resp = await fetch(url + '/api/users/me/oldPassword', {
      method: 'POST',
      body: JSON.stringify({ password: oldPassword }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(resp);
    if (resp.ok) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const saveImg = (e) => {
    const profile = e.target.files[0];
    setImage(profile);
  };

  const checkOldPassword = (value) => {
    setOldPassword(value);
  };

  useEffect(() => {
    if (oldPassword.length > 0) {
      checkPassword();
    } else if (oldPassword.length === 0) {
      setError(false);
    }
  }, [oldPassword]);

  return (
    <div className={styles.Settings}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={12} className={styles.Col}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='. . .'
              />
            </Form.Group>

            <Form.Group controlId='surname'>
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type='text'
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder='. . .'
              />
            </Form.Group>
          </Col>
          <Col md={12} className={styles.Col}>
            <Form.Group controlId='age'>
              <Form.Label>Age</Form.Label>
              <Form.Control
                type='number'
                value={age}
                min={18}
                onChange={(e) => setAge(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='birthday'>
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type='date'
                value={birthday.slice(0, 10)}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={12} className={styles.Col}>
            <input
              style={{ color: 'transparent' }}
              type='file'
              id='image'
              profile='file'
              onChange={saveImg}
              accept='image/*'
            />

            <button
              className={styles.PassButton}
              onClick={() => setChangePass(!changePass)}
              type='button'
            >
              Change Password
            </button>
          </Col>

          {changePass && (
            <Col md={12} className={styles.Col}>
              <Form.Group>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type='password'
                  className={styles.OldPassword}
                  value={oldPassword}
                  onChange={(e) => checkOldPassword(e.target.value)}
                />
                {error && (
                  <div className={styles.ErrorMessage}>
                    {' '}
                    Old password is not correct!
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId='password'>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Col>
          )}
          <Col md={12} className={styles.Col}>
            <button className={styles.SubmitButton} type='submit'>
              Change Infos
            </button>
          </Col>
        </Row>
      </Form>

      <Toast
        show={showPopOver}
        onClose={() => setShowPopOver(false)}
        className={styles.PopOver}
      >
        <Toast.Header>
          <strong className='mr-auto'>Page</strong>
          <small>1s ago</small>
        </Toast.Header>
        <Toast.Body>{popOverMessage}</Toast.Body>
      </Toast>
    </div>
  );
};
