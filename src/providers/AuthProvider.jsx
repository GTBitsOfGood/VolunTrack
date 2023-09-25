import { useSession } from "next-auth/react";
import router from "next/router";
import PropTypes from "prop-types";
import ResetPage from "../pages/passwordreset/[resetCode]";
import AuthPage from "../screens/Auth";
import LandingPage from "../components/LandingPage";
import OnboardingPage from "../screens/Onboarding/OnboardingPage";

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
      // unauthenticated, send to login page
      else if (router.pathname === "/organization-onboarding")
        return <OnboardingPage />;
      else if (router.pathname === "/login") return <AuthPage />;
      else if (router.pathname === "/[nonprofitCode]")
        return <AuthPage createAccount={true} nonprofitCode={true} />;
      else if (router.pathname === "/passwordreset/[resetCode]")
        return <ResetPage></ResetPage>;
      return <LandingPage />;
  }
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
