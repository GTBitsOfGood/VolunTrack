import React from 'react';
import PropTypes from 'prop-types';

import { AdminDash } from '.';
import UserDash from './UserDash/UserDash';

const Authenticated = ({ user }) => {
  if (user.role === 'admin') return <AdminDash user={user} />;
  if (user.role === 'volunteer') return <UserDash user={user} />;
  else return <></>;
};

Authenticated.propTypes = {
  user: PropTypes.object.isRequired
};

export default Authenticated;
