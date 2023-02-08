import "focus-visible/dist/focus-visible.min.js";
import { signIn } from "next-auth/react";
import "normalize.css";
import styled from "styled-components";
import AuthForm from "./AuthForm";
import { Button } from "flowbite-react";
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
    display: flex;
    padding: 4em;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  TopText: styled.p`
    font-size: 32px;
    font-weight: bold;
  `,
  OrDiv: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 1.5vw;
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
        {/* <img
          alt="Bits of Good Logo"
          src="/images/bog_logo.png"
          style={{ width: "100%", marginBottom: "2px" }}
        /> */}
        <Styled.TopText>
          {props.createAccount ? "Create an Account" : "Sign In"}
        </Styled.TopText>
        <div className="flex flex-wrap w-full gap-2 items-center">
          <Button color="light" className="w-full py-1" onClick={login}>
            <img
              alt="Google Logo"
              src="/images/google.svg"
              className="mr-2 h-6 w-6"
            />
            <p className="text-lg my-0">Continue with Google</p>
          </Button>
        </div>
        <Styled.OrDiv>
          <hr size="150" width="150" color="#6C757D"></hr>
          OR
          <hr size="150" width="150" color="#6C757D"></hr>
        </Styled.OrDiv>
        <br></br>
        <AuthForm
          createAccount={props.createAccount}
          context={useContext(RequestContext)}
        />
        <div style={{ display: "flex" }}>
          {props.createAccount
            ? "Already have an account?"
            : "Don't have an account?"}
          <a
            style={{ marginLeft: "5px" }}
            href={`${window.location.origin}/${
              props.createAccount ? "login" : "create-account"
            }`}
          >
            {props.createAccount ? "Sign In" : "Create an account"}
          </a>
        </div>
      </Styled.Container>
    </Styled.Main>
  );
};

export default AuthPage;

AuthPage.propTypes = {
  createAccount: PropTypes.bool,
};
