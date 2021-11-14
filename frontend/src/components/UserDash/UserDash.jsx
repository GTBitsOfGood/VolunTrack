import React from 'react';
import styled from 'styled-components';
import { Route, Redirect } from 'react-router-dom';
import EventManager from './events/EventManager';
import Profile from '../Shared/Profile';

const Container = styled.div`
  background: white;
  height: 100%;
  width: 100%;
`;

const UserDash = ({ user }) => (
  <Container>
    <Route path="/events" component={() => <EventManager user={user} />} />
    <Route path="/profile" render={() => <Profile user={user} />} />
    <Route exact path="/">
      <Redirect to="/events" />
    </Route>
  </Container>
);

export default UserDash;
