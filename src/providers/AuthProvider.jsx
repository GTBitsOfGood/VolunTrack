import { useSession } from "next-auth/react";
import router from "next/router";
import PropTypes from "prop-types";
import ResetPage from "../pages/passwordreset/[resetCode]";
import AuthPage from "../screens/Auth";
import LandingPage from "../components/LandingPage";
import DayOfCheckin from "../pages/events/[eventId]/day-of-check-in";
import AddOrganizationModal from "../components/AddOrganizationModal";

// AuthProvider wraps the entire application and makes sure only authenticated users can access the app
const AuthProvider = ({ children }) => {
  const { status, data, update } = useSession();

  switch (status) {
    case "authenticated":
      if (data?.user == null) {
        return <AuthPage />;
      } else if (data?.user?.organizationId) {
        return <>{children}</>;
      } else {
        return <AddOrganizationModal data={data} />;
      }
    case "loading":
      return <p>loading...</p>;
    default:
      if (router.pathname === "/create-account")
        return <AuthPage createAccount={true} />;
      else if (router.pathname === "/login") return <AuthPage />;
      else if (router.pathname === "/[nonprofitCode]")
        return <AuthPage createAccount={true} nonprofitCode={true} />;
      else if (router.pathname === "/passwordreset/[resetCode]")
        return <ResetPage></ResetPage>;
      return <LandingPage />;
        return <DayOfCheckin></DayOfCheckin>;
  }
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
