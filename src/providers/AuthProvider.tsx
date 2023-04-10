import { useSession } from "next-auth/react";
import router from "next/router";
import PropTypes from "prop-types";
import { createContext } from "react";
import { UserDocument } from "../../server/mongodb/models/User";
import AuthPage from "../screens/Auth";
import OnboardingPage from "../screens/Onboarding/OnboardingPage";

export const UserContext = createContext<UserDocument | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  switch (status) {
    case "authenticated":
      return (
        <UserContext.Provider value={session.user}>
          {children}
        </UserContext.Provider>
      );
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
      return <AuthPage />;
  }
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
