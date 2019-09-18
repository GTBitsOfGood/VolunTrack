// NPM Packages
import React from 'react';
import { Jumbotron, Col, Panel } from 'react-bootstrap';

// Local Imports
import SplashInfo from '../components/SplashInfo';
import LoginForm from './forms/LoginForm';

// Home component
const Splash = () => (
  <div>
    <Col md={7} mdOffset={1} style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
      <Jumbotron style={{ backgroundColor: '#f06afn', opacity: 0.8 }}>
        <div style={{ paddingLeft: '25px' }}>
          <h1>Welcome to the DrawChange Volunteer Portal!</h1>
          <p>From here you can become a volunteer and sign up for events!</p>
        </div>
      </Jumbotron>

      <SplashInfo />
      {/* Add this for insta feed http://instafeedjs.com/ */}
    </Col>

    <Col md={3} className="loginbox">
      <div>
        <Panel header={<h3>Login</h3>}>
          <LoginForm />
        </Panel>
      </div>
    </Col>
  </div>
);

export default Splash;
