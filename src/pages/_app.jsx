import React, { useState } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import Header from "../components/Header";
import "focus-visible/dist/focus-visible.min.js";
import "normalize.css";
import "../../public/static/styles/App.css";
import styled from "styled-components";
import axios from "axios";
import Splash from "../components/Splash";
import StyleProvider from "../providers/StyleProvider";
import RequestProvider from "../providers/RequestProvider";

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
  `,
};

const MyApp = ({ Component, pageProps, router, currentUser }) => {
  // TODO: take this logic outside of _app.jsx
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const login = (user) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = (e) => {
    e.preventDefault();
    setIsAuthenticated(false);
    setUser({});
    axios.post("/auth/logout");
  };

  return (
    <>
      <Head>
        <title>Helping Mamas App</title>
      </Head>
      {/* <div className="App">
      <Header loggedIn={currentUser != null} currentRoute={router.asPath} />
      <div className="Content">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div> */}
      <StyleProvider>
        <RequestProvider>
          <Styled.Container>
            {isAuthenticated ? (
              <>
                <Header onLogout={logout} user={user} />
                <Component user={user} {...pageProps} />
              </>
            ) : (
              <>
                <Splash onAuth={login} />
              </>
            )}
          </Styled.Container>
        </RequestProvider>
      </StyleProvider>
    </>
  );
};

// MyApp.getInitialProps = async (appContext) => {
//   // TODO: THIS AUTH SYSTEM IS NOT BEST PRACTICE:
//   // https://github.com/vvo/iron-session
//   const { res } = appContext.ctx;

//   const appProps = await App.getInitialProps(appContext);

//   const cookies = appContext.ctx.req ? appContext.ctx.req.headers.cookie : null;

//   const route = appContext.ctx.asPath;

//   const computedProps = await getCurrentUser(cookies)
//     .then((user) => {
//       if (route === "/login") {
//         if (res) {
//           res.writeHead(301, { Location: urls.pages.app.home });
//           res.end();
//         } else {
//           return Router.replace(urls.pages.app.home);
//         }
//       }

//       return {
//         ...appProps,
//         currentUser: user,
//       };
//     })
//     .catch(() => {
//       if (route.startsWith("/app")) {
//         if (res) {
//           res.writeHead(301, { Location: urls.pages.index });
//           res.end();
//         } else {
//           return Router.replace(urls.pages.index);
//         }
//       }

//       return appProps;
//     });

//   return computedProps;
// };

MyApp.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  // currentUser: PropTypes.shape({
  //   id: PropTypes.string.isRequired,
  //   username: PropTypes.string.isRequired,
  // }),
};

MyApp.defaultProps = {
  currentUser: null,
};

export default MyApp;
