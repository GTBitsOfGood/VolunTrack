import { ClockIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const PendingApplication = () => {
  const { data: session } = useSession();
  const [timeElapsed, setTimeElapsed] = useState("");

  useEffect(() => {
    if (session?.user?.appliedAt) {
      const appliedDate = new Date(session.user.appliedAt);
      const now = new Date();
      const diffInHours = Math.floor((now - appliedDate) / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays > 0) {
        setTimeElapsed(`${diffInDays} day${diffInDays > 1 ? 's' : ''}`);
      } else if (diffInHours > 0) {
        setTimeElapsed(`${diffInHours} hour${diffInHours > 1 ? 's' : ''}`);
      } else {
        setTimeElapsed("Just now");
      }
    }
  }, [session]);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100">
            <ClockIcon className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Application Pending Review
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your volunteer application is currently under review
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">
                  Status: Under Review
                </p>
                <p className="text-sm text-gray-500">
                  Applied {timeElapsed} ago
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                What happens next?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-2 w-2 bg-gray-300 rounded-full mt-2"></div>
                  <span className="ml-3">Our team will review your application</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-2 w-2 bg-gray-300 rounded-full mt-2"></div>
                  <span className="ml-3">We may contact you for additional information</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-2 w-2 bg-gray-300 rounded-full mt-2"></div>
                  <span className="ml-3">You'll receive an email notification once reviewed</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Need help?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 mr-3" />
                  <span>Email: support@voluntrack.org</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-5 w-5 mr-3" />
                  <span>Phone: (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApplication;
