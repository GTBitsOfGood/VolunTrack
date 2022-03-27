import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import PropTypes from "prop-types";

class Footer extends Component {
  googleResponse = (response) => {
    const tokenBlob = new Blob(
      [JSON.stringify({ access_token: response.accessToken }, null, 2)],
      {
        type: "application/json",
      }
    );
    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default",
    };
    fetch("/auth/google", options).then((r) => {
      r.json().then((user) => {
        return this.props.onAuth(user);
      });
    });
  };

  loginFailed = () => alert("Something went wrong. Please try again");

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GoogleLogin
          clientId="664357147813-mcoqj5m0cc3en7hfdgl9botpie9k4qvm.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={this.googleResponse}
          onFailure={this.loginFailed}
        />
      </div>
    );
  }
}

Footer.propTypes = {
  onAuth: PropTypes.func,
};

export default Footer;
