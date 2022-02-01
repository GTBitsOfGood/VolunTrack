import classes from "./IndexPage.module.css";
import axios from "axios";

import { SessionProvider } from "next-auth/react";
import Header from "../../components/Header";
import "normalize.css";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import StyleProvider from "../../providers/StyleProvider";
import RequestProvider from "../../providers/RequestProvider";
import { useSession, signIn } from "next-auth/react";

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

const IndexPage = () => {
  const { data: session } = useSession();

  const login = (e) => {
    e.preventDefault();
    signIn("google");
  };

  return (
    <>
      {session ? (
        <>
          <Head>
            <title>Helping Mamas App</title>
          </Head>
          <StyleProvider>
            <RequestProvider>
              <Styled.Container>
                <Header />
                <p>this is the index page</p>
              </Styled.Container>
            </RequestProvider>
          </StyleProvider>
        </>
      ) : (
        <a href={`/api/auth/signin`} onClick={login}>
          Sign in
        </a>
      )}
    </>
  );
};

export default IndexPage;
