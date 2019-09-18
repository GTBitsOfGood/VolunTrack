// NPM Packages
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/lib/Navbar';
import Logo from '../../assets/images/drawchange_logo.png';
//import './assets/stylesheets/base.scss';

export const GuestNavbar = () => (
  <Navbar collapseOnSelect className="navBar guest">
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">
          <img style={{ width: '200px' }} src={Logo} />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
  </Navbar>
);
