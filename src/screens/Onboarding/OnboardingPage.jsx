import { useSession } from "next-auth/react";
import { useContext } from "react";
import { RequestContext } from "../../providers/RequestProvider";
import OnboardingForm from "./OnboardingForm";

const OnboardingPage = () => {
  return (
    <>
      <OnboardingForm
        context={useContext(RequestContext)}
      />
    </>
  );
};

export default OnboardingPage;
