import "focus-visible/dist/focus-visible.min.js";
import { signIn } from "next-auth/react";
import "normalize.css";
import styled from "styled-components";
import AuthForm from "./AuthForm";
import { Button } from "reactstrap";
import PropTypes from "prop-types";
import { useContext } from "react";
import { RequestContext } from "../../providers/RequestProvider";

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
    width: 500px;
    height: 600px;
    background: white;
    display: flex;
    padding: 4em;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
};

const AuthPage = (props) => {
  const login = (e) => {
    e.preventDefault();
    signIn("google");
  };

  return (
    <Styled.Main>
      <Styled.Container>
        <img
          alt="Bits of Good Logo"
          src="/images/bog_logo.png"
          style={{ width: "100%", marginBottom: "2px" }}
        />
        <p>
          {props.createAccount
            ? "Create an account"
            : "Sign in to your account"}
        </p>
        <AuthForm
          createAccount={props.createAccount}
          context={useContext(RequestContext)}
        />
        <div style={{ display: "flex", marginBottom: "6px", marginTop: "2px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "black" }} />
          <div style={{ width: "40px", textAlign: "center" }}>OR</div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "black" }} />
        </div>{" "}
        <Button
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
          }}
          onClick={login}
        >
          <img
            alt="Google Logo"
            src="/images/google.svg"
            className="mr-3 h-full w-auto py-2"
          />
          {props.createAccount ? "Sign up" : "Sign in"} with Google
        </Button>
        <a
          href={`${window.location.origin}/${
            props.createAccount ? "login" : "create-account"
          }`}
        >
          Or {props.createAccount ? "sign in" : "sign up"}
        </a>
      </Styled.Container>
    </Styled.Main>
  );
};

export default AuthPage;

AuthPage.propTypes = {
  createAccount: PropTypes.bool,
};
