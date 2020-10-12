import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import styles from './About.module.scss';

const About = () => {
  return (
    <>
      <div className={styles.About}>
        <Row className={styles.Row}>
          <Col sm={12} className={styles.Col}>
            <h3>What is YOLO about?</h3>
          </Col>
          <Col sm={12} className={styles.Col}>
            <h5>
              Our product offers flexibility and ease in managing any event and
              the participants will enjoy all the features of the product, which
              means the full satisfaction of attending the event. With YOLO, any
              event becomes an unforgettable experience.
            </h5>
          </Col>

          <Col sm={6} md={6} className={styles.ImgCol}>
            <Image src='/assets/socialize.png' />
          </Col>
          <Col sm={6} md={6} className={styles.InfoCol}>
            <p>
              With YOLO you just choose if you want to interact, you choose when
              and with whom you want to do it. All you have to do to make new
              acquaintances is to be in the same place as the people you want to
              know. Everything is for real and it just happens right under your
              eyes at that moment.
            </p>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default About;
