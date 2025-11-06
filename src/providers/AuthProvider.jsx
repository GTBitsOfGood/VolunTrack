import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import ResetPage from "../pages/passwordreset/[resetCode]";
import AuthPage from "../screens/Auth";
import LandingPage from "../screens/LandingPage";
import DayOfCheckin from "../screens/DayOfCheckIn";
import AddOrganizationModal from "../components/AddOrganizationModal";
import LoadingScreen from "../components/LoadingScreen";
import WelcomePageDisplay from "../screens/WelcomePage/WelcomePageDisplay";
import ApplicationFormUser from "../screens/ApplicationPortal/ApplicationFormUser";

// AuthProvider wraps the entire application and makes sure only authenticated users can access the app
const AuthProvider = ({ children }) => {
  const { status, data, update } = useSession();
  const hasProcessedApplicationForm = useRef(false);
  const currentUserId = useRef(null);

  // Reset ref when user changes
  useEffect(() => {
    if (data?.user?._id?.toString() !== currentUserId.current) {
      currentUserId.current = data?.user?._id?.toString() || null;
      hasProcessedApplicationForm.current = false;
    }
  }, [data?.user?._id]);

  // Stable callback to avoid re-renders
  const handleApplicationFormSuccess = useCallback(() => {
    hasProcessedApplicationForm.current = true;
    // Optimistically mark application as having responses to prevent re-rendering the form
    if (data?.user) {
      update({ user: { ...data.user, applicationResponses: [{ __skipped: true }] } });
    } else {
      update();
    }
  }, [data?.user, update]);

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
      } else if (
        data?.user?.organizationId &&
        data?.user?.role !== "admin" && // Admins skip the application form
        (!Array.isArray(data?.user?.applicationResponses) || data?.user?.applicationResponses.length === 0)
      ) {
        // Check if we've already processed this (prevent infinite loop)
        // If applicationResponses has the __skipped marker, we've already handled it
        const hasSkipped = Array.isArray(data?.user?.applicationResponses) &&
                          data.user.applicationResponses.length > 0 &&
                          data.user.applicationResponses.some(r => r?.__skipped);

        if (hasSkipped || hasProcessedApplicationForm.current) {
          // Already processed, skip showing form
          return <>{children}</>;
        }

        // Show application form if user hasn't filled it out yet
        return <ApplicationFormUser onSubmitSuccess={handleApplicationFormSuccess} />;
      } else if (data?.user?.applicationStatus === "pending" || data?.user?.applicationStatus === "rejected") {
        // Block access for pending or rejected applications
        return <WelcomePageDisplay user={data.user} update={update} />;
      } else if (data?.user?.firstTimeLogin && data?.user?.applicationStatus === "approved") {
        // Show welcome page for first-time approved users
        return <WelcomePageDisplay user={data.user} update={update} />;
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
