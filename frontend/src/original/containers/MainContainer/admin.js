// NPM Packages
import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Local Imports
import Dashboard from '../Dashboard';
import EventContainer from '../EventContainer';
import VolunteersContainer from '../VolunteersContainer';
// import EventCreate from '../../components/EventCreate';
import EventForm from '../forms/EventForm';

export const AdminContainer = () => (
  <Switch>
    <Route path={'/events/new'} component={EventForm} />
    <Route path={'/events/:id'} component={EventContainer} />
    <Route path={'/events'} component={EventContainer} />
    <Route path={'/volunteers/:id'} component={VolunteersContainer} />
    <Route path={'/volunteers'} component={VolunteersContainer} />
    <Route path={'/'} component={Dashboard} />
  </Switch>
);
