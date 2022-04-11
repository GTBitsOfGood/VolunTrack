import { useSession } from "next-auth/react";
import router from "next/router";
import PropTypes from "prop-types";
import React from "react";
import LoginPage from "../screens/Login";

// AuthProvider wraps the entire appication and makes sure only authenticated users can access the app
const AuthProvider = ({ children }) => {
  const { status } = useSession();

  switch (status) {
    case "authenticated":
      return <>{children}</>;
    case "loading":
      return <p>loading...</p>;
    default:
      // unauthenticated, send to login page
      if (router.pathname !== "/login") router.push("/login");
      return <LoginPage />;
  }
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
