import { useRouter } from "next/router";
import ApplicationCard from "./ApplicationCard";
import { useEffect, useState } from "react";
import { Spinner, Toast } from "flowbite-react";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const dummyData = {
  id: "1",
  name: "VolunteerName",
  requested: "2025-09-18T00:00:00.000+00:00",
  email: "VolunteerEmail@gmail.com",
  phone: "xxxxxxxxxx",
  responses: [
    {
      question: "Are you a black lesbian over 40?",
      type: "radio",
      response: [{ option: "Yes", value: true }],
      required: true,
    },
    {
      question: "Have you paid dues?",
      type: "dropdown",
      response: "Yes",
      required: true,
    },
    {
      question: "Anything else we should know?",
      type: "short",
      response: "N/A",
      required: false,
    },
    {
      question: "Skill Preferences",
      type: "multi",
      response: [{ option: "Social Media", value: true }],
      required: true,
    },
  ],
  status: "pending",
};

export default function Application() {
  const router = useRouter();
  const { applicationId } = router.query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/applications/${applicationId}`);

      if (response.data.success) {
        const app = response.data.application;

        // Format responses based on the application structure
        let formattedResponses = [];

        if (app.applicationResponses && app.applicationResponses.length > 0) {
          // User has custom application responses - format them for display
          formattedResponses = app.applicationResponses.map((resp) => {
            let formattedResponse = resp.response;

            // Format radio responses: convert string to array of objects
            if (resp.type === "radio" && typeof resp.response === "string") {
              formattedResponse = [{ option: resp.response, value: true }];
            }

            return {
              question: resp.question,
              type: resp.type,
              response: formattedResponse,
              required: resp.required,
            };
          });
        } else {
          // Fallback: show basic user information if no custom responses
          formattedResponses = [
            {
              question: "Full Name",
              type: "short",
              response: `${app.firstName} ${app.lastName}`,
              required: true,
            },
            {
              question: "Email",
              type: "short",
              response: app.email,
              required: true,
            },
            {
              question: "Phone",
              type: "short",
              response: app.phone || "N/A",
              required: false,
            },
          ];
        }

        // Transform the data to match the expected format
        const transformedData = {
          id: app._id,
          name: `${app.firstName} ${app.lastName}`,
          requested: app.createdAt,
          email: app.email,
          phone: app.phone || "N/A",
          status: app.applicationStatus,
          responses: formattedResponses,
        };

        setData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      setErrorMessage("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  function handleBackClick() {
    router.push("/application-portal");
  }

  async function updateStatus(id, status) {
    try {
      if (status === "approved") {
        await axios.post("/api/applications/approve", {
          email: data.email,
        });
        setSuccessMessage(`Application for ${data.name} approved successfully!`);
      } else if (status === "rejected") {
        await axios.post("/api/applications/reject", {
          email: data.email,
        });
        setSuccessMessage(`Application for ${data.name} rejected successfully!`);
      }

      // Redirect back to application portal after a short delay
      setTimeout(() => {
        router.push("/application-portal");
      }, 2000);
    } catch (error) {
      console.error("Error updating application status:", error);
      setErrorMessage(error.response?.data?.error || "Failed to update application status");
    }
  }

  if (loading) {
    return (
      <div className="mt-16 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col px-12 text-black">
      <button
        onClick={handleBackClick}
        className="mb-10 flex w-fit items-center gap-2 font-open-sans text-lg text-secondary-grey"
      >
        <img
          src="/images/backArrow.svg"
          alt="custom icon"
          className="h-[1em] w-[1em]"
        />
        Back to Applications
      </button>

      {/* Success Toast */}
      {successMessage && (
        <div className="mb-4">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <div className="pl-2 text-sm font-normal">{successMessage}</div>
            <Toast.Toggle onDismiss={() => setSuccessMessage("")} />
          </Toast>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="mb-4">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <XCircleIcon className="h-5 w-5" />
            </div>
            <div className="pl-2 text-sm font-normal">{errorMessage}</div>
            <Toast.Toggle onDismiss={() => setErrorMessage("")} />
          </Toast>
        </div>
      )}

      <ApplicationCard data={data} extended updateStatus={updateStatus} />
    </div>
  );
}
