import { Button } from "flowbite-react";
import "focus-visible/dist/focus-visible.min.js";
import { signIn } from "next-auth/react";
import "normalize.css";
import AuthForm from "./AuthForm";
import { useState } from "react";
import { Modal } from "flowbite-react";
import { TextInput } from "flowbite-react";
import PropTypes from "prop-types";
import { useContext } from "react";
import { RequestContext } from "../../providers/RequestProvider";
import { sendResetPasswordEmail } from "../../queries/users";
import Footer from "../../components/Footer";
import Text from "../../components/Text";
import { stringify } from "querystring";

const AuthPage = (props) => {
  // let url = new URL(window.location.href).pathname;
  // let nonprofitCode =
  //   url === "/create-account" || url === "/login" ? "" : url.substring(1);

  const login = async (e) => {
    e.preventDefault();
    await signIn("google"); // { callbackUrl: `/?orgCode=${nonprofitCode}` }
  };

  const [showModal, setShowModal] = useState(false);

  const sendResetEmail = async () => {
    const email = document.getElementById("email1").value;

    const response = await sendResetPasswordEmail(
      stringify({ email: email }),
      false
    ).catch((error) => {
      if (error.response.status !== 200) {
        alert(`Error sending email to ${email}.`);
      }
    });

    if (response?.status === 200) {
      setShowModal(false);
      alert(`A password reset email has been sent to ${email}.`);
    }
  };

  return (
    <div className="flex-column my-4 flex h-full w-full items-center justify-center">
      <div
        className={
          "flex-column mx-auto mb-8 flex w-5/6 items-center justify-center rounded-xl border p-8 shadow-xl sm:w-[28rem] " +
          (props.createAccount ? "mt-64 md:mt-48" : "mt-16")
        }
      >
        {/* <img
          alt="Bits of Good Logo"
          src="/images/bog_logo.png"
          style={{ width: "100%", marginBottom: "2px" }}
        /> */}
        <Text
          text={props.createAccount ? "Create an Account" : "Sign In"}
          type="header"
          className="mb-4 pt-3"
        />
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
        <div className="mb-1 mt-4 flex w-full items-center justify-between">
          <hr size="150" width="150" color="#6C757D" />
          <Text text="OR" />
          <hr size="150" width="150" color="#6C757D" />
        </div>
        <br></br>
        <AuthForm
          createAccount={props.createAccount}
          context={useContext(RequestContext)}
        />
        <div className="mt-1 flex flex-col items-center">
          <div>
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
          <div>
            {!props.createAccount && (
              <>
                Forgot your password?
                <a
                  className="ml-2 text-sm underline"
                  onClick={() => setShowModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="underline">Reset Password</span>
                </a>
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                  <Modal.Header className="h-16">Reset Password</Modal.Header>
                  <Modal.Body>
                    <div className="space-y-6">
                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Enter your email below and we&apos;ll send you a link to
                        reset your password.
                      </p>
                      <TextInput
                        id="email1"
                        type="email"
                        placeholder="example@bitsofgood.com"
                        required={true}
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button color="info" onClick={() => sendResetEmail()}>
                      Send Email
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
          </div>
        </div>
        {/*{!props.createAccount && (*/}
        {/*  <div className="mt-1 flex items-center">*/}
        {/*    Forgot Password?*/}
        {/*    <Text*/}
        {/*      text={"Reset Password"}*/}
        {/*      href={`${window.location.origin}/${*/}
        {/*        props.createAccount ? "login" : "create-account"*/}
        {/*      }`}*/}
        {/*      className="ml-2"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*)}*/}
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
