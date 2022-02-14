import { signIn } from "next-auth/react";
import React from "react";
import GoogleButton from "react-google-button";

const LoginPage = () => {
  const login = (e) => {
    e.preventDefault();
    signIn("google");
  };

  return <GoogleButton onClick={login} type="light" />;
};

export default LoginPage;
