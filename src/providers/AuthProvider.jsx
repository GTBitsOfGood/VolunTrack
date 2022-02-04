import React from "react";
import { useSession, signIn } from "next-auth/react";
import GoogleButton from "react-google-button";
import PropTypes from "prop-types";

const AuthProvider = ({ children }) => {
  const { data: session } = useSession();

  const login = (e) => {
    e.preventDefault();
    signIn("google");
  };

  return (
    <>
      {session ? (
        <>{children}</>
      ) : (
        <GoogleButton type="light" onClick={login} />
      )}
    </>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
