import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Posts.module.scss';
import { Row, Col, Card, Image, Dropdown } from 'react-bootstrap';
import { refreshTokens } from '../../../Utilities';
import { connect } from 'react-redux';
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import { HiOutlinePhotograph } from 'react-icons/hi';

const url = process.env.REACT_APP_BE_ENDPOINT;
const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch, props) => ({
  follow: (user) =>
    dispatch({
      type: 'FOLLOW_USER',
      payload: user,
    }),
  refreshTokens: (history) => dispatch(refreshTokens(history)),
});

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const followUser = async (user) => {
    const resp = await fetch(
      url + '/api/users/' + props.user.username + '/follow/' + user.username,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (resp.ok) {
      const answer = await resp.json();
      props.follow(user);
    } else if (resp.status === 401) {
      props.refreshTokens(props.history);
    }
  };

  const fetchPosts = async () => {
    const resp = await fetch(url + '/api/posts', {
      credentials: 'include',
    });

    if (resp.ok) {
      const posts = await resp.json();
      setPosts(posts.reverse());
    } else if (resp.status === 401) {
      props.refreshTokens(props.history);
    }
  };

  const handelNewPost = async () => {
    const photo = new FormData();
    photo.append('post', image);

    const resp = await fetch(url + '/api/posts/', {
      method: 'POST',
      body: JSON.stringify({ text }),
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });

    if (resp.ok) {
      if (image !== null) {
        const id = await resp.json();
        const resp2 = await fetch(url + '/api/posts/me/' + id, {
          method: 'POST',
          body: photo,
          credentials: 'include',
        });
        if (resp2.ok) {
          fetchPosts();
          setText('');
          setImage(null);
        } else if (resp2.staus === 401) {
          props.refreshTokens(props.history);
        }
      } else {
        fetchPosts();
        setText('');
        setImage(null);
      }
    } else if (resp.staus === 401) {
      props.refreshTokens(props.history);
    }
  };

  const saveImg = (e) => {
    const post = e.target.files[0];
    setImage(post);
  };

  const deletePost = async (id) => {
    const resp = await fetch(url + '/api/posts/' + id, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (resp.ok) {
      fetchPosts();
    } else if (resp.status === 401) {
      props.refreshTokens();
    }
  };

  useEffect(() => {
    if (localStorage.getItem('loggedIn')) {
      fetchPosts();
    }
    if (!props.loggedIn) {
      props.history.push('/');
    }
  }, [props.user]);

  return (
    <div className={styles.Posts}>
      <Row className={styles.Row}>
        <Col sm={12} className={styles.PostCol}>
          <h4>Post a new post</h4>
          <div className={styles.NewPostSection}>
            <textarea
              type='text'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={() => handelNewPost()}>Post</button>
            <label htmlFor='post' className='pointer'>
              <HiOutlinePhotograph />
            </label>
            <input
              style={{ display: 'none' }}
              type='file'
              id='post'
              profile='file'
              onChange={(e) => saveImg(e)}
              accept='image/*'
            />
          </div>

          <div className={styles.PostsBlocks}>
            {posts.length > 0 &&
              posts.map((post, key) => (
                <Card key={key} className={styles.Card}>
                  <Card.Body className={styles.CardBody}>
                    <div className={styles.PostInfo}>
                      <Image
                        src={
                          post.user.image
                            ? post.user.image
                            : 'https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png'
                        }
                      />
                      <Card.Title className={styles.CardTitle}>
                        <p>
                          {post.user.name} {post.user.surname}
                        </p>

                        {props.user && post.user._id !== props.user._id && (
                          <button onClick={() => followUser(post.user)}>
                            {props.user &&
                            props.user.following.find(
                              (user) => user._id === post.user._id
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
                      </Card.Title>
                      {props.user && post.user._id === props.user._id && (
                        <Dropdown className={styles.Dropdown}>
                          <Dropdown.Toggle
                            variant='success'
                            id='dropdown-basic'
                          ></Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item href='#/action-1'>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => deletePost(post._id)}>
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                    <Card.Text className={styles.PostText}>
                      {post.text}
                    </Card.Text>
                  </Card.Body>
                  <div className='d-flex justify-content-center'>
                    {post.image && <Card.Img variant='top' src={post.image} />}
                  </div>
                </Card>
              ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
