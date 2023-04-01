import "focus-visible/dist/focus-visible.min.js";
import { signIn } from "next-auth/react";
import "normalize.css";
import AuthForm from "./AuthForm";
import { Button } from "flowbite-react";
import PropTypes from "prop-types";
import { useContext } from "react";
import { RequestContext } from "../../providers/RequestProvider";
import Footer from "../../components/Footer";
import Text from "../../components/Text";

const AuthPage = (props) => {
  const login = (e) => {
    e.preventDefault();
    signIn("google");
  };

  return (
    <div className="flex-column flex h-full w-full items-center justify-center">
      <div className="flex-column mx-auto my-2 flex w-1/2 items-center justify-center lg:w-1/4">
        {/* <img
          alt="Bits of Good Logo"
          src="/images/bog_logo.png"
          style={{ width: "100%", marginBottom: "2px" }}
        /> */}
        <div className="h-28" />
        <Text text={props.createAccount ? "Create an Account" : "Sign In"} theme="header" className="pb-2"/>
        <div className="flex w-full flex-wrap items-center gap-2">
          <Button color="light" className="w-full py-1" onClick={login}>
            <img
              alt="Google Logo"
              src="/images/google.svg"
              className="mr-2 h-6 w-6"
            />
            <p className="my-0 text-lg">Continue with Google</p>
          </Button>
        </div>
        <div className="mt-2 flex w-full items-center justify-between">
          <hr size="150" width="150" color="#6C757D" />
          <Text text="OR"/>
          <hr size="150" width="150" color="#6C757D" />
        </div>
        <br></br>
        <AuthForm
          createAccount={props.createAccount}
          context={useContext(RequestContext)}
        />
        <div className="mt-1 flex items-center">
          {props.createAccount
            ? "Already have an account?"
            : "Don't have an account?"}
          <Text
            text={props.createAccount ? "Sign In" : "Create an account"}
            href={`${window.location.origin}/${
              props.createAccount ? "login" : "create-account"
            }`}
            className="ml-2"
          />
        </div>
      </div>
      <div className="grow" />
      <Footer />
    </div>
  );
};

export default AuthPage;

AuthPage.propTypes = {
  createAccount: PropTypes.bool,
};
