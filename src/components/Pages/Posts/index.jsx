import React, { useEffect, useState } from 'react';
import styles from './Posts.module.scss';
import { Row, Col, Card, Image, Dropdown } from 'react-bootstrap';
import { refreshTokens } from '../../../Utilities';
import { connect } from 'react-redux';
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import { HiOutlinePhotograph } from 'react-icons/hi';

const url = process.env.REACT_APP_BE_ENDPOINT;
const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch, props) => ({
  follow: (id) =>
    dispatch({
      type: 'FOLLOW_USER',
      payload: id,
    }),
  refreshTokens: (history) => dispatch(refreshTokens(history)),
});

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const followUser = async (id) => {
    const resp = await fetch(url + '/api/users/follow/' + id, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (resp.ok) {
      const answer = await resp.json();
      props.follow(id);
    } else if (resp.status === 401) {
      props.refreshTokens();
    }
  };

  const fetchPosts = async () => {
    const resp = await fetch(url + '/api/posts', {
      credentials: 'include',
    });

    if (resp.ok) {
      const posts = await resp.json();
      setPosts(posts);
    } else if (resp.status === 401) {
      props.refreshTokens();
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
    console.log(resp);
    if (resp.ok) {
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
        props.refreshTokens();
      }
    } else if (resp.staus === 401) {
      props.refreshTokens();
    }
  };

  const saveImg = (e) => {
    const post = e.target.files[0];
    setImage(post);
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
        <Col sm={12} md={4} lg={5} className={styles.Reklam}>
          <h3>Reklam</h3>
        </Col>
        <Col sm={12} md={8} lg={7} className={styles.PostCol}>
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
            {posts.map((post, key) => (
              <Card key={key} className={styles.Card}>
                <Card.Body className={styles.CardBody}>
                  <div className={styles.PostInfo}>
                    <Image src={post.user.image} />
                    <Card.Title className={styles.CardTitle}>
                      <p>
                        {post.user.name} {post.user.surname}
                      </p>

                      {props.user && post.user._id !== props.user._id && (
                        <button onClick={() => followUser(post.user._id)}>
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
                    <Dropdown className={styles.Dropdown}>
                      <Dropdown.Toggle
                        variant='success'
                        id='dropdown-basic'
                      ></Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>Edit</Dropdown.Item>

                        <Dropdown.Item href='#/action-3'>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <Card.Text className={styles.PostText}>{post.text}</Card.Text>
                </Card.Body>
                <div className='d-flex justify-content-center'>
                  <Card.Img variant='top' src={post.image} />
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
