import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';
import Logo from '../assets/images/drawchange_logo.png';
// Local Components

const DeniedSplash = () => (
  <div>
    <Col md={6} mdOffset={3}>
      <Image style={{ paddingLeft: '33%' }} src={Logo} />
      <p>
        Thank you for submitting your volunteer application for drawchange. We are not in need of
        your services, but we encourage you to follow us on social media!{' '}
      </p>
    </Col>
  </div>
);

export default DeniedSplash;
