import {
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
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
        setTimeElapsed(`${diffInDays} day${diffInDays > 1 ? "s" : ""}`);
      } else if (diffInHours > 0) {
        setTimeElapsed(`${diffInHours} hour${diffInHours > 1 ? "s" : ""}`);
      } else {
        setTimeElapsed("Just Now");
      }
    }
  }, [session]);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <ClockIcon className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Application Pending Review
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your volunteer application is currently under review
          </p>
        </div>

        <div className="rounded-lg bg-white p-6">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-400"></div>
              </div>
              <div className="ml-4 [&>*]:mb-0">
                <p className="text-lg font-medium text-gray-900">
                  Status: Under Review
                </p>
                <p className="text-sm text-gray-500">
                  Applied {timeElapsed}{" "}
                  {timeElapsed !== "Just Now" ? "ago" : ""}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-xl font-medium text-gray-900">
                What happens next?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-300"></div>
                  <span className="ml-3">
                    Our team will review your application
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-300"></div>
                  <span className="ml-3">
                    We may contact you for additional information
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-300"></div>
                  <span className="ml-3">
                    You'll receive an email notification once reviewed
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-xl font-medium text-gray-900">
                Need help?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="mr-3 h-5 w-5" />
                  <span>
                    Email:{" "}
                    {session?.contactEmail
                      ? session.contactEmail
                      : "support@voluntrack.org"}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="mr-3 h-5 w-5" />
                  <span>
                    Phone:{" "}
                    {session?.contactPhone
                      ? session.contactPhone
                      : "555-123-4567"}
                  </span>
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
