import {
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const RejectedApplication = () => {
  const { data: session } = useSession();
  const [rejectionDate, setRejectionDate] = useState("");

  useEffect(() => {
    if (session?.user?.rejectedAt) {
      const rejectedDate = new Date(session.user.rejectedAt);
      setRejectionDate(rejectedDate.toLocaleDateString());
    }
  }, [session]);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Application Not Approved
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Unfortunately, your volunteer application was not approved at this
            time
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">
                  Status: Not Approved
                </p>
                <p className="text-sm text-gray-500">
                  Rejected on {rejectionDate}
                </p>
              </div>
            </div>

            {session?.user?.rejectionReason && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-xl font-medium text-gray-900">
                  Reason for Rejection
                </h3>
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <p className="text-red-800">{session.user.rejectionReason}</p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-xl font-medium text-gray-900">
                What can you do?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-300"></div>
                  <span className="ml-3">
                    Contact us to discuss your application
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-300"></div>
                  <span className="ml-3">
                    Reapply in the future if circumstances change
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-300"></div>
                  <span className="ml-3">
                    Explore other volunteer opportunities
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-xl font-medium text-gray-900">
                Contact Information
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

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => (window.location.href = "/create-account")}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-primaryColor px-6 py-3 text-base font-medium text-white hover:bg-hoverColor focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2"
              >
                <ArrowPathIcon className="mr-2 h-5 w-5" />
                Apply Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedApplication;
