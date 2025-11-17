import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Alert, Button } from "flowbite-react";
import { signOut } from "next-auth/react";
import axios from "axios";
import { loadWelcomePage, getWelcomePageToggle } from "../../queries/organizations";
import PropTypes from "prop-types";

const WelcomePageDisplay = ({ user, update }) => {
  const [pageContent, setPageContent] = useState("");
  const [pageToggle, setPageToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.organizationId) {
      // Load welcome page content
      loadWelcomePage(user.organizationId.toString())
        .then((response) => {
          if (response.data?.welcomePage) {
            const sanitizedWelcomePage = DOMPurify.sanitize(
              response.data.welcomePage
            );
            setPageContent(sanitizedWelcomePage);
          }
        })
        .catch((error) => console.error("API request error:", String(error)));

      // Load welcome page toggle
      getWelcomePageToggle(user.organizationId.toString())
        .then((response) => {
          if (response.data?.welcomePageToggle !== undefined) {
            setPageToggle(response.data.welcomePageToggle);
          }
        })
        .catch((error) => console.error("API request error:", String(error)));
    }
  }, [user]);

  const handleContinueToDashboard = async () => {
    setLoading(true);
    try {
      // Update firstTimeLogin to false
      await axios.put(`/api/users/${user._id}`, {
        firstTimeLogin: false,
      });

      // Update the session to reflect the change (optimistic)
      await update({ user: { ...user, firstTimeLogin: false } });
    } catch (error) {
      console.error("Error updating firstTimeLogin:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusAlert = () => {
    const status = user?.applicationStatus;

    if (status === "pending") {
      return (
        <Alert color="warning" className="mb-6">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-lg">
              Application Under Review
            </span>
            <p>
              Thank you for creating an account! Your application is currently
              being reviewed by our team. You will receive an email notification
              once your application has been processed.
            </p>
            <p className="text-sm mt-2">
              In the meantime, please check your email for updates.
            </p>
          </div>
        </Alert>
      );
    }

    if (status === "rejected") {
      return (
        <Alert color="failure" className="mb-6">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-lg">Application Not Approved</span>
            {user?.rejectionReason && (
              <p>
                <strong>Reason:</strong> {user.rejectionReason}
              </p>
            )}
            <p>
              Unfortunately, your application was not approved at this time. If
              you believe this was an error or would like to reapply, please
              contact the organization administrator.
            </p>
          </div>
        </Alert>
      );
    }

    if (status === "approved" && user?.firstTimeLogin) {
      return (
        <Alert color="success" className="mb-6">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-lg">
              Welcome! Your Application Has Been Approved
            </span>
            <p>
              Congratulations! Your application has been approved. You now have
              full access to the platform. Click the button below to get started.
            </p>
          </div>
        </Alert>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (pageToggle && pageContent) {
      return (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: pageContent }}
        />
      );
    }
    return null;
  };

  const renderActions = () => {
    const status = user?.applicationStatus;

    if (status === "approved" && user?.firstTimeLogin) {
      return (
        <div className="flex gap-4 justify-center mt-6">
          <Button
            color="blue"
            size="lg"
            onClick={handleContinueToDashboard}
            disabled={loading}
          >
            {loading ? "Loading..." : "Continue to Dashboard"}
          </Button>
        </div>
      );
    }

    if (status === "pending" || status === "rejected") {
      return (
        <div className="flex gap-4 justify-center mt-6">
          <Button
            color="gray"
            size="lg"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        {getStatusAlert()}
        {renderContent()}
        {renderActions()}
      </div>
    </div>
  );
};

WelcomePageDisplay.propTypes = {
  user: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
};

export default WelcomePageDisplay;
