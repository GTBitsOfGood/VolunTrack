// NPM Packages
import React from 'react';
import PropTypes from 'prop-types';
import { AdminNavbar } from './admin';
import { VolunteerNavbar } from './volunteer';
import { PendingNavbar } from './pending';
import { GuestNavbar } from './guest';
import { DeniedNavbar } from './denied';

export const Navbar = ({ user, ...props }) => {
  if (user && user.bio.role === 'admin') {
    return <AdminNavbar {...props} />;
  } else if (user && user.bio.role === 'volunteer') {
    return <VolunteerNavbar {...props} />;
  } else if (user && user.bio.role === 'pending') {
    return <PendingNavbar {...props} />;
  } else if (user && user.bio.role === 'denied') {
    return <DeniedNavbar {...props} />;
  }
  return <GuestNavbar {...props} />;
};

Navbar.propTypes = {
  user: PropTypes.object
};
