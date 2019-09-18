import React from 'react';
import { Switch, Route } from 'react-router-dom';

import PostRegisterSplash from '../../components/PostRegisterSplash';

export const PendingContainer = () => (
  <Switch>
    <Route path={'/'} component={PostRegisterSplash} />
  </Switch>
);
