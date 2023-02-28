import { useSession } from "next-auth/react";
import router from "next/router";
import PropTypes from "prop-types";
import AuthPage from "../screens/Auth";
import OnboardingPage from "../screens/Onboarding/OnboardingPage";
import BogApproval from "../screens/Management/BogApproval";

// AuthProvider wraps the entire application and makes sure only authenticated users can access the app
const AuthProvider = ({ children }) => {
  const { status } = useSession();

  switch (status) {
    case "authenticated":
      return <>{children}</>;
    case "loading":
      return <p>loading...</p>;
    default:
      if (router.pathname === "/create-account")
        return <AuthPage createAccount={true} />;
      else if (router.pathname === "/bog-acceptance")
        return <BogApproval/>
      // unauthenticated, send to login page
      else if (router.pathname === "/organization-onboarding")
        return <OnboardingPage />;
      else if (router.pathname !== "/login") router.push("/login");
      return <AuthPage />;
  }
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
