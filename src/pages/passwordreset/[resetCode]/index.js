import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import styled from "styled-components";
import { fetchEventsById, getUserIdFromCode } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import { RequestContext } from "../../../providers/RequestProvider";
import EventUnregisterModal from "../../../components/EventUnregisterModal";
import Text from "../../../components/Text";
import { TextInput, Button } from "flowbite-react";
import { changePasswordValidator } from "../../../screens/Auth/helpers";
import { Formik } from "formik";
import InputField from "../../../components/Forms/InputField";
import { updateUser } from "../../../actions/queries";

const ResetPage = () => {
  const router = useRouter();
  const { resetCode } = router.query;
  const [isValidCode, setIsValidCode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [showUnregisterModal, setUnregisterModal] = useState(false);

  const checkIfValidCode = async () => {
    // check if code is valid

    const response = await getUserIdFromCode(resetCode);

    if (response.data.userId) {
      setUserId(response.data.userId.userId);
      setIsValidCode(true);
    }
  };

  useEffect(() => {
    checkIfValidCode();
  }, []);

  const handleSubmit = async (values) => {
    await updateUser(userId, {
      password: values.password,
    });

    setIsSubmitted(true);
  };

  return (
    <>
      <div className="flex-column flex h-full w-full items-center justify-center">
        <div className="flex-column mx-auto my-2 flex w-1/2 items-center justify-center lg:w-1/4">
          <div className="pt-5 pb-3 text-xl font-bold">Reset Password</div>

          {!isSubmitted ? (
            <>
              {isValidCode ? (
                <>
                  <Formik
                    initialValues={{
                      password: "",
                      password_confirm: "",
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      setSubmitting(true);
                      handleSubmit(values);
                      setSubmitting(false);
                    }}
                    validationSchema={changePasswordValidator}
                  >
                    {({ handleSubmit, isValid, isSubmitting }) => (
                      <form className="flex-column flex w-full space-y-2">
                        <InputField
                          name="password"
                          label="Password"
                          type="password"
                          placeholder="Your Password"
                          autoComplete="current-password"
                        />
                        <InputField
                          name="password_confirm"
                          label="Confirm Password"
                          type="password"
                          placeholder="Your Password"
                        />

                        <BoGButton
                          type="submit"
                          onClick={handleSubmit}
                          disabled={!isValid || isSubmitting}
                          text={"Submit"}
                          className="bg-primaryColor hover:bg-hoverColor w-full"
                        />
                      </form>
                    )}
                  </Formik>
                  {/* New Password:
              <TextInput
                name="password"
                label="Password"
                type="password"
                placeholder="Your Password"
                autoComplete="current-password"
              />
              Confirm Password:
              <TextInput
                name="password_confirm"
                label="Confirm Password"
                type="password"
                placeholder="Your Password"
              />
              <Button color="info" onClick= {submitPassword}

               >Submit</Button> */}
                </>
              ) : (
                <>
                  Code is not valid. It may have expired or been used already.
                  Please request a new one.
                </>
              )}
            </>
          ) : (
            <>
              <div>
                Password submitted. Click <a href="/login">here</a> to login.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPage;
