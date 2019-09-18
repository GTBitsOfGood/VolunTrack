import React, { Component } from 'react';

import { Container, Row, Col, Jumbotron } from 'reactstrap';
import { SocialIcon } from 'react-social-icons';

class PendingVolunteer extends Component {
  urls = [
    'https://twitter.com/drawchange',
    'https://www.facebook.com/drawchange',
    'http://www.flickr.com/photos/drawchange',
    'http://youtube.com/drawchange',
    'https://www.linkedin.com/company/drawchange',
    'https://www.tumblr.com/tagged/drawchange',
    'http://instagram.com/drawchange',
    'https://www.pinterest.com/drawchange/',
    'https://plus.google.com/102192290642344173249'
  ];
  render() {
    return (
      <Container>
        <Row>
          <Col md={{ offset: 2, size: 8 }}>
            <Jumbotron
              style={{
                marginTop: '50px',
                backgroundColor: 'rgb(255, 220, 172)',
                borderRadius: '.9rem'
              }}
            >
              <h1 className="display-3"> Thank You! </h1>
              <p className="lead">
                We are very excited that you want to get involved with the work we do! Our
                volunteers are very important to us and we review every application very closley. We
                will notify you as soon as your status has been decided! Until then please feel free
                to follow us on social media or check out our{' '}
                <a href="http://drawchange.org">website!</a>
              </p>
              {this.urls.map((url, index) => (
                <SocialIcon key={index} url={url} style={{ margin: '0 5px' }} />
              ))}
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PendingVolunteer;
