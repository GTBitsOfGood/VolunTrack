import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BoGButton from "../../../components/BoGButton";
import { changePasswordValidator } from "../../../screens/Auth/helpers";
import { Formik } from "formik";
import InputField from "../../../components/Forms/InputField";
import {
  updateUser,
  deleteResetCode,
  getUserIdFromCode,
} from "../../../queries/users";

const ResetPage = () => {
  const router = useRouter();
  const { resetCode } = router.query;
  const [isValidCode, setIsValidCode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    // delete the code from the ResetCode model
    await deleteResetCode(resetCode, userId);

    setIsSubmitted(true);
  };

  return (
    <>
      <div className="flex-column flex h-full w-full items-center justify-center">
        <div className="flex-column mx-auto my-2 flex w-1/2 items-center justify-center lg:w-1/4">
          <div className="pb-3 pt-5 text-xl font-bold">Reset Password</div>

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
                          className="w-full bg-blue-500 hover:bg-blue-400"
                        />
                      </form>
                    )}
                  </Formik>
                </>
              ) : (
                <div>
                  Code is not valid. It may have expired or been used already.
                  Please request a new one. Click <a href="/login">here</a> to
                  return to login.
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                Password updated! Click <a href="/login">here</a> to login.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPage;
