import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import ApplicationList from "./ApplicationList";

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

  const [appData, setAppData] = useState(null);
  const [currAppPage, setCurrAppPage] = useState(0);

  const [historyData, setHistoryData] = useState(null);
  const [currHistoryPage, setCurrHistoryPage] = useState(0);

  useEffect(() => {
    //TODO
    //DUMMY DATA
    //CONTACT REAL ENDPOINTS HERE

    setAppData(dummyAppData);
    setHistoryData(dummyHistoryData);

    setLoading(false);
  }, []);

  function updateStatus(id, status) {
    //TODO
    //CALL ENDPOINT TO UPDATE STATUS
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
