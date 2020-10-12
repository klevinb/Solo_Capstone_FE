import React from 'react';
import Tada from 'react-reveal/Tada';
import { Carousel, Image, Row, Col } from 'react-bootstrap';
import styles from './Home.module.scss';

export default () => (
  <>
    <div className={styles.Container}>
      <div className={styles.Main}>
        <Row className={styles.Section}>
          <Col sm={12} md={8} className={styles.Details}>
            <div className={styles.Intro}>
              <p className={styles.MainTitle}>
                A product that boosts direct socialization
              </p>
              <p className={styles.SecondTitle}>
                It has never been easier to meet someone. It's not about other
                virtual knowledge, but real friends, in flesh and bones.
              </p>
              <div className={styles.DownloadPhotos}>
                <Image src='/assets/playstore.png' />
                <Image src='/assets/appstore.png' />
              </div>
            </div>
          </Col>
          <Col sm={12} md={4} className={styles.Perview}>
            <Carousel>
              <Carousel.Item>
                <Image src='/assets/phone.png' />
              </Carousel.Item>
              <Carousel.Item>
                <Image src='/assets/phone1.png' />
              </Carousel.Item>
              <Carousel.Item>
                <Image src='/assets/phone2.png' />
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </div>
    </div>
  </>
);
