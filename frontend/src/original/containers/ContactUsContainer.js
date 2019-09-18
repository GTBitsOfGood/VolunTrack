// NPM Packages
import React from 'react';
import { Jumbotron } from 'react-bootstrap';

import { connect } from 'react-redux';
// Local Imports
import ContactUsForm from './forms/ContactUsForm';

// Home component

const ContactUsContainer = () => {
  return (
    <div>
      <Jumbotron
        style={{
          backgroundColor: 'rgba(255, 255, 255, 1)',
          marginLeft: '210px',
          marginRight: '316px',
          marginBottom: '0px'
        }}
      >
        <div style={{ paddingLeft: '25px' }}>
          <h1>We would love to hear from you!</h1>
          <p>Please fill out the information below, and we will get back to you soon!</p>
        </div>
      </Jumbotron>
      <ContactUsForm />
    </div>
  );
};

export default ContactUsContainer;
