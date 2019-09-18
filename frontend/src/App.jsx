import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import { Header, Authenticated, Splash } from './components';
import { StyleWrapper, RequestProvider } from './components/Shared';

const Styled = {
  Container: styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  Content: styled.main`
    flex: 1;
    overflow-y: scroll;
  `
};

class App extends Component {
  state = { isAuthenticated: true, user: { role: 'admin' }, token: '' };

  fakeAuth = _ => this.setState({ user: { role: null } });

  logout = e => {
    e.preventDefault();
    this.setState({ isAuthenticated: false, user: null });
    axios.get('/auth/logout');
  };
  auth = user => {
    this.setState({ isAuthenticated: true, user });
  };

  render() {
    const { isAuthenticated, user } = this.state;
    return (
      <Router>
        <StyleWrapper>
          <RequestProvider>
            <Styled.Container>
              <Header
                onLogout={this.logout}
                loggedIn={isAuthenticated}
                role={user ? user.role : null}
              />
              <Styled.Content>
                {user ? <Authenticated user={user} /> : <Splash onAuth={this.fakeAuth} />}
              </Styled.Content>
            </Styled.Container>
          </RequestProvider>
        </StyleWrapper>
      </Router>
    );
  }
}

export default App;
