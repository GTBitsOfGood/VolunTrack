import { useRouter } from "next/router";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import ApplicationResponse from "./ApplicationResponse";

export default function ApplicationCard({
  data,
  extended = false,
  updateStatus,
}) {
  const router = useRouter();

  function handleMoreClick() {
    router.push(`/application-portal/${data.id}`);
  }

  function handleApproveClick() {
    updateStatus(data.id, "approved");
  }

  function handleDenyClick() {
    updateStatus(data.id, "denied");
  }

  function formatPhone(str) {
    return str.slice(0, 3) + "-" + str.slice(3, 6) + "-" + str.slice(6);
  }

  function formatDate(str) {
    return new Intl.DateTimeFormat("en-US").format(new Date(str));
  }

  let chip = null;
  if (data.status == "approved") {
    chip = (
      <div className="rounded-full bg-success px-4 py-1 font-inter text-sm font-semibold text-white">
        Approved
      </div>
    );
  } else if (data.status == "denied") {
    chip = (
      <div className="rounded-full bg-error px-4 py-1 font-inter text-sm font-semibold text-white">
        Denied
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md bg-form-grey p-8">
        <div className="flex items-center gap-6 ">
          <h1 className="m-0 font-inter text-lg font-semibold">
            Volunteer Name:{" "}
            <span className="font-inter font-medium text-secondary-grey">
              {data.name}
            </span>
          </h1>
          {chip}
          {!extended && (
            <button
              onClick={handleMoreClick}
              className="ml-auto flex items-center gap-1 font-inter text-base font-semibold text-primaryColor"
            >
              View More Info
              <ChevronRightIcon className="mr-3 h-[1.2em]" />
            </button>
          )}
        </div>
        <hr className="border-quaternary" />
        <div className="flex gap-20">
          <div className="flex flex-col">
            <h2 className="m-0 font-inter text-sm font-semibold">
              Requested Date
            </h2>
            <p className="m-0 font-inter text-sm text-secondary-grey">
              {formatDate(data.requested)}
            </p>
          </div>
          <div className="flex flex-col">
            <h2 className="m-0 font-inter text-sm font-semibold">Email</h2>
            <p className="m-0 font-inter text-sm text-secondary-grey">
              {data.email}
            </p>
          </div>
          <div className="flex flex-col">
            <h2 className="m-0 font-inter text-sm font-semibold">Phone</h2>
            <p className="m-0 font-inter text-sm text-secondary-grey">
              {formatPhone(data.phone)}
            </p>
          </div>
          {data.status == "pending" && !extended && (
            <div className="ml-auto flex gap-4 self-center">
              <button
                onClick={handleApproveClick}
                className="w-28 rounded-sm bg-primaryColor py-2 font-inter text-sm font-semibold text-form-grey"
              >
                Approve
              </button>
              <button
                onClick={handleDenyClick}
                className="w-28 rounded-sm border-[1px] border-primaryColor py-2 font-inter text-sm font-semibold text-primaryColor"
              >
                Deny
              </button>
            </div>
          )}
        </div>
        {extended && data.responses.length > 0 && (
          <>
            <h1 className="my-10 font-inter text-2xl font-semibold">
              Application Responses
            </h1>
            <div className="mb-6 flex flex-col gap-16">
              {data.responses.map((response, i) => (
                <ApplicationResponse key={i} data={response} />
              ))}
            </div>
          </>
        )}
      </div>
      {data.status == "pending" && extended && (
        <div className="mb-20 ml-auto mt-8 flex gap-4 self-center">
          <button
            onClick={handleApproveClick}
            className="w-28 rounded-sm bg-primaryColor py-2 font-inter text-sm font-semibold text-form-grey"
          >
            Approve
          </button>
          <button
            onClick={handleDenyClick}
            className="w-28 rounded-sm border-[1px] border-primaryColor py-2 font-inter text-sm font-semibold text-primaryColor"
          >
            Deny
          </button>
        </div>
      )}
    </>
  );
}
