import { signIn } from "next-auth/react";
import React from "react";
import GoogleButton from "react-google-button";
import variables from "../../design-tokens/_variables.module.scss";

const LoginPage = () => {
  const login = (e) => {
    e.preventDefault();
    signIn("google");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "1000px",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${variables["$gray-200"]}`,
          margin: "4em",
        }}
      >
        <div style={{ width: "50%", padding: "4em" }}>
          <h1>Sign In</h1>
          <p>
            Become a volunteer - you&apos;ll be able to help mothers nationwide
            by joining events
          </p>
          <GoogleButton type="light" onClick={login} />
        </div>
        <div style={{ width: "50%" }}>
          <img src="/images/test.jpg" alt="image" width="100%" height="500px" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
