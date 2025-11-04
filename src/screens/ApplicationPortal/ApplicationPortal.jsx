import { Spinner, Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ApplicationList from "./ApplicationList";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

//DUMMY DATA, CAN DELETE LATER
const dummyAppData = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

const dummyAppDataEmpty = [];

const dummyHistoryData = [
  {
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
    status: "approved",
  },
  {
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
    status: "denied",
  },
];

//PAGE SIZE
const PAGE_SIZE = 3;

export default function ApplicationPortal() {
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState([]);
  const [currAppPage, setCurrAppPage] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [currHistoryPage, setCurrHistoryPage] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Fetch pending applications for "New Applications"
      const pendingResponse = await axios.get("/api/applications", {
        params: { status: "pending", organizationId: session?.user?.organizationId },
      });

      // Fetch approved/rejected applications for "Application History"
      const historyResponse = await axios.get("/api/applications", {
        params: { organizationId: session?.user?.organizationId },
      });

      if (pendingResponse.data.success) {
        const pendingApps = pendingResponse.data.applications.map(app => ({
          id: app._id,
          name: `${app.firstName} ${app.lastName}`,
          requested: app.createdAt,
          email: app.email,
          phone: app.phone || "N/A",
          status: app.applicationStatus,
        }));
        setAppData(pendingApps);
      }

      if (historyResponse.data.success) {
        const historyApps = historyResponse.data.applications
          .filter(app => app.applicationStatus !== "pending")
          .map(app => ({
            id: app._id,
            name: `${app.firstName} ${app.lastName}`,
            requested: app.createdAt,
            email: app.email,
            phone: app.phone || "N/A",
            status: app.applicationStatus,
          }));
        setHistoryData(historyApps);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setErrorMessage("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.organizationId) {
      fetchApplications();
    }
  }, [session]);

  async function updateStatus(id, status) {
    try {
      const application = [...appData, ...historyData].find(app => app.id === id);
      if (!application) {
        setErrorMessage("Application not found");
        return;
      }

      if (status === "approved") {
        await axios.post("/api/applications/approve", {
          email: application.email,
        });
        setSuccessMessage(`Application for ${application.name} approved successfully!`);
      } else if (status === "rejected") {
        await axios.post("/api/applications/reject", {
          email: application.email,
        });
        setSuccessMessage(`Application for ${application.name} rejected successfully!`);
      }

      // Refresh the applications list
      await fetchApplications();
    } catch (error) {
      console.error("Error updating application status:", error);
      setErrorMessage(error.response?.data?.error || "Failed to update application status");
    }
  }

  function handleChangeAppPage(pageNum) {
    setCurrAppPage(pageNum);
  }

  function handleChangeHistoryPage(pageNum) {
    setCurrHistoryPage(pageNum);
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
      <h1 className="mb-3 font-open-sans text-3xl font-bold">
        Volunteer Application Portal
      </h1>

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

      <ApplicationList
        title="New Applications"
        data={appData}
        updateStatus={updateStatus}
        pageSize={PAGE_SIZE}
        currentPage={currAppPage}
        updatePageCallback={handleChangeAppPage}
      />
      <ApplicationList
        title="Application History"
        data={historyData}
        updateStatus={updateStatus}
        pageSize={PAGE_SIZE}
        currentPage={currHistoryPage}
        updatePageCallback={handleChangeHistoryPage}
      />
    </div>
  );
}
