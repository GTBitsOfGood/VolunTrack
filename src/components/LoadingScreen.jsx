import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getOrganization } from "../queries/organizations";

const LoadingScreen = ({ size = "md", fullScreen = false }) => {
  const session = useSession();
  const [logoUrl, setLogoUrl] = useState("/images/voluntrack.svg");

  useEffect(() => {
    const fetchOrgLogo = async () => {
      if (session?.data?.user?.organizationId) {
        try {
          const response = await getOrganization(
            session.data.user.organizationId
          );
          if (response.data.organization?.imageUrl) {
            setLogoUrl(response.data.organization.imageUrl);
          }
        } catch (error) {
          // Fallback to VolunTrack logo
          console.log("Using default VolunTrack logo");
        }
      }
    };
    fetchOrgLogo();
  }, [session]);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const spinnerSizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50"
    : "flex items-center justify-center w-full py-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-6">
        <img
          src={logoUrl}
          alt="Loading"
          className={`${sizeClasses[size]} object-contain`}
        />
        <div className="relative">
          <div
            className={`${spinnerSizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-primaryColor`}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

LoadingScreen.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullScreen: PropTypes.bool,
};
