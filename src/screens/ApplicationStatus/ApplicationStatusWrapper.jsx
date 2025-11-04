import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PendingApplication from "./PendingApplication";
import RejectedApplication from "./RejectedApplication";

const ApplicationStatusWrapper = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show loading while session is being fetched
  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primaryColor"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no session, redirect to login
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // If session exists but no user data, show loading
  if (!session?.user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primaryColor"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  const user = session.user;
  const applicationStatus = user.applicationStatus;

  // If user is not approved, show status page as dashboard content
  if (applicationStatus !== "approved") {
    switch (applicationStatus) {
      case "pending":
        return <PendingApplication />;

      case "rejected":
        return <RejectedApplication />;

      default:
        // Unknown status, default to pending
        console.warn("Unknown application status:", applicationStatus);
        return <PendingApplication />;
    }
  }

  // User is approved, show the normal app content
  return children;
};

export default ApplicationStatusWrapper;
