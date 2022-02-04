import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import "normalize.css";
import React from "react";
import GoogleButton from "react-google-button";
import styled from "styled-components";

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
  const { status } = useSession();

  const login = (e) => {
    e.preventDefault();
    signIn("google");
  };

  return (
    <>
      {status == "loading" && <p>loading...</p>}
      {status == "unauthenticated" && (
        <GoogleButton type="light" onClick={login} />
      )}
      {status == "authenticated" && (
        <>
          <Head>
            <title>Helping Mamas App</title>
          </Head>
        </>
      )}
    </>
  );
};

export default IndexPage;
