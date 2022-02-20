import "bootstrap/dist/css/bootstrap.min.css";
import "focus-visible/dist/focus-visible.min.js";
import { signIn } from "next-auth/react";
import "normalize.css";
import React from "react";
import GoogleButton from "react-google-button";
import styled from "styled-components";

const Styled = {
  Main: styled.div`
    width: 100%;
    height: 100%;
    background: hsl(0, 0%, 95%);
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  Container: styled.div`
    width: 1000px;
    height: 500px;
    background: white;
    display: flex;
    margin: 4em;
  `,
  Left: styled.div`
    width: 50%;
    padding: 4em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    @media (max-width: 900px) {
      align-items: center;
      width: 100%;
    }
  `,
  Image: styled.img`
    @media (max-width: 900px) {
      display: none;
    }
  `,
};

const LoginPage = () => {
  const login = (e) => {
    e.preventDefault();
    signIn("google");
  };

  return (
    <Styled.Main>
      <Styled.Container>
        <Styled.Left>
          <h1>Sign In</h1>
          <p>
            Become a volunteer - you&apos;ll be able to help mothers nationwide
            by joining events!
          </p>
          <GoogleButton onClick={login} />
        </Styled.Left>
        <Styled.Image
          src="/images/press-page-photo.png"
          alt="helping-mamas-photo"
        />
      </Styled.Container>
    </Styled.Main>
  );
};

export default LoginPage;
