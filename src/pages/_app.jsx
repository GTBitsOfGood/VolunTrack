import "focus-visible/dist/focus-visible.min.js";
import { SessionProvider } from "next-auth/react";
import "normalize.css";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import "../../public/static/styles/App.css";
import "../../public/static/styles/bootstrap.min.css";
import Header from "../components/Header";
import AuthProvider from "../providers/AuthProvider";
import RequestProvider from "../providers/RequestProvider";
import StyleProvider from "../providers/StyleProvider";

const Styled = {
  Container: styled.div`
    height: inherit;
    width: 100vw;
    display: flex;
    flex-direction: column;
    overflow: scroll;
  `,
  Content: styled.main`
    flex: 1;
    overflow-y: scroll;
  `,
};

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <StyleProvider>
          <RequestProvider>
            <Styled.Container>
              <Header />
              <Component {...pageProps} />
            </Styled.Container>
          </RequestProvider>
        </StyleProvider>
      </AuthProvider>
    </SessionProvider>
  );
};

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
