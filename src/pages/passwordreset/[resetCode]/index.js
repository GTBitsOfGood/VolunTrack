import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import styled from "styled-components";
import { fetchEventsById } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import { RequestContext } from "../../../providers/RequestProvider";
import EventUnregisterModal from "../../../components/EventUnregisterModal";
import Text from "../../../components/Text";
import { TextInput, Button } from "flowbite-react";

const ResetPage = () => {
  const router = useRouter();
  const { resetCode } = router.query;
  const [isValidCode, setIsValidCode] = useState(true);

  const [showUnregisterModal, setUnregisterModal] = useState(false);

  return (
    <>
      <div className="flex-column flex h-full w-full items-center justify-center">
        <div className="flex-column mx-auto my-2 flex w-1/2 items-center justify-center lg:w-1/4">
          <div className="pt-5 pb-3 text-xl font-bold">Reset Password</div>

          {isValidCode ? (
            <>
              <div>Reset Code: {resetCode}</div>
              New Password:
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
              <Button color="info">Submit</Button>
            </>
          ) : (
            <>
              Code is not valid. It may have expired or been used already.
              Please request a new one.
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPage;
