import { signIn, useSession } from "next-auth/react";
import PropTypes from "prop-types";
import React from "react";
import GoogleButton from "react-google-button";

const AuthProvider = ({ children }) => {
  const { status } = useSession();

  const login = (e) => {
    e.preventDefault();
    signIn("google");
  };

  switch (status) {
    case "authenticated":
      return <>{children}</>;
    case "loading":
      return <p>loading...</p>;
    default:
      return <GoogleButton type="light" onClick={login} />;
  }
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
