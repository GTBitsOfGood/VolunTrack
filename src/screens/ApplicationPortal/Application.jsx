import { useRouter } from "next/router";
import ApplicationCard from "./ApplicationCard";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";

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

  useEffect(() => {
    //TODO CALL ROUTE TO GET APP DATA BASED ON APP ID
    setLoading(false);
    setData(dummyData);
  }, []);

  function handleBackClick() {
    router.push("/application-portal");
  }

  function updateStatus(id, status) {
    //TODO, APPROVE/REJECT HERE
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
      <ApplicationCard data={data} extended updateStatus={updateStatus} />
    </div>
  );
}
