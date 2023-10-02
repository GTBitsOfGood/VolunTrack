import { useSession } from "next-auth/react";
import router from "next/router";
import PropTypes from "prop-types";
import ResetPage from "../pages/passwordreset/[resetCode]";
import AuthPage from "../screens/Auth";
import OnboardingPage from "../screens/Onboarding/OnboardingPage";
import AddOrganizationModal from "../components/AddOrganizationModal";

// AuthProvider wraps the entire application and makes sure only authenticated users can access the app
const AuthProvider = ({ children }) => {
  const { status, data, update } = useSession();

  switch (status) {
    case "authenticated":
      if (data?.user?.organizationId) {
        return <>{children}</>;
      } else {
        return <AddOrganizationModal userId={data?.user?._id} />;
      }
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
      return <AuthPage />;
  }
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
