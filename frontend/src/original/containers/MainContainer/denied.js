import React from 'react';
import { Switch, Route } from 'react-router-dom';

import DeniedSplash from '../../components/DeniedSplash';

export const DeniedContainer = () => (
  <Switch>
    <Route path={'/'} component={DeniedSplash} />
  </Switch>
);
