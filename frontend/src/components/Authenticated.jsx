import React from 'react';
import PropTypes from 'prop-types';

import { AdminDash } from '.';

const Authenticated = ({ user }) => (
  <React.Fragment>{user.role === 'admin' && <AdminDash user={user} />}</React.Fragment>
);

Authenticated.propTypes = {
  user: PropTypes.object.isRequired
};

export default Authenticated;
