import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect } from "react";
import PropTypes from "prop-types";
import ResetPage from "../pages/passwordreset/[resetCode]";
import AuthPage from "../screens/Auth";
import LandingPage from "../screens/LandingPage";
import DayOfCheckin from "../screens/DayOfCheckIn";
import AddOrganizationModal from "../components/AddOrganizationModal";
import LoadingScreen from "../components/LoadingScreen";

// AuthProvider wraps the entire application and makes sure only authenticated users can access the app
const AuthProvider = ({ children }) => {
  const { status, data, update } = useSession();

  // If already authenticated but still on public auth pages, redirect to home
  useEffect(() => {
    if (status === "authenticated") {
      if (router.pathname === "/login" || router.pathname === "/create-account") {
        router.replace("/home");
      }
    }
  }, [status]);

  switch (status) {
    case "authenticated":
      if (data?.user == null) {
        return <AuthPage />;
      } else if (data?.user?.organizationId) {
        // If we are on login/create-account the effect above will redirect
        return <>{children}</>;
      } else {
        return <AddOrganizationModal data={data} />;
      }
    case "loading":
      return <LoadingScreen fullScreen={true} size="lg" />;
    default:
      if (router.pathname === "/create-account")
        return <AuthPage createAccount={true} />;
      else if (router.pathname === "/login") return <AuthPage />;
      else if (router.pathname === "/[nonprofitCode]")
        return <AuthPage createAccount={true} nonprofitCode={true} />;
      else if (router.pathname === "/passwordreset/[resetCode]")
        return <ResetPage></ResetPage>;
      else if (router.pathname === "/events/[eventId]/day-of-check-in")
        return <DayOfCheckin></DayOfCheckin>;
      else return <LandingPage />;
  }
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
