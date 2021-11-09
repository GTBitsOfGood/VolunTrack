import React, { useState } from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import { Header, Authenticated, Splash } from './components';
import { StyleProvider, RequestProvider } from './providers';

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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const login = user => {
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = e => {
    e.preventDefault();
    setIsAuthenticated(false);
    setUser({});
    axios.post('/auth/logout');
  };

  return (
    <Router>
      <StyleProvider>
        <RequestProvider>
          <Styled.Container>
            {isAuthenticated ? (
              <>
                <Header onLogout={logout} loggedIn={isAuthenticated} user={user} />
                <Styled.Content>
                  <Authenticated user={user} /> :
                </Styled.Content>
              </>
            ) : (
              <>
                {window.location.pathname !== '/' && <Redirect to="/" />}
                <Splash onAuth={login} />
              </>
            )}
          </Styled.Container>
        </RequestProvider>
      </StyleProvider>
    </Router>
  );
};

export default App;
