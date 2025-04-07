import { Card } from "flowbite-react";
import PropTypes from "prop-types";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import BoGButton from "../../components/BoGButton";
import { editRegistration } from "../../queries/registrations";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "../../queries/users";
import styles from "./RegistrationCard.module.css";

const RegistrationCard = (props) => {
  const [regCount, setRegCount] = useState(0);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    getUser(props.registration.userId).then((response) => {
      if (response.data.user) {
        setName(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        );
        setEmail(`${response.data.user.email}`);
      }
    });
    setRegCount(props.regCount);
  }, [props.regCount]);

  const handleApprove = async () => {
    try {
      await editRegistration(props.registration._id, { approved: "approved" });
      props.onApprove();
    } catch (error) {
      console.error("Error approving registration:", error);
    }
  };

  const handleDeny = async () => {
    try {
      await editRegistration(props.registration._id, { approved: "denied" });
      props.onDeny();
    } catch (error) {
      console.error("Error denying registration:", error);
    }
  };

  return (
    <Card className="w-full !border-none !bg-[#F9F9F9] !shadow-none">
      <div className="flex justify-center">
        <div className="flex flex-row items-center">
          <div className="mr-2 font-semibold">Volunteer Name: </div>
          <div className={`mr-2 ${styles.title}`}>
            {name || "No Name Available"}
          </div>
        </div>

        <div className="grow" />
        <div className="flex-rows flex items-center">
          <div className="mr-2 font-semibold" style={{ fontSize: "14px" }}>
            Requested Date
          </div>
          <div className={`mr-2 ${styles.date}`}>
            {new Date(props?.registration?.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "2-digit",
                day: "2-digit",
                year: "2-digit",
              }
            ) || "No Date Available"}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row items-center">
          <div className="mr-2 font-semibold">Event: </div>
          <div className={`mr-2 ${styles.title}`}>
            {props?.event?.eventParent?.title || "Event Name"}
          </div>
        </div>
        <Link
          href={`/events/${props?.event?._id}/register`}
          className="flex flex-row items-center"
        >
          <div className="flex flex-row">
            <CalendarDaysIcon className="h-6 w-6 cursor-pointer text-primaryColor" />
            <span className="ml-2 flex cursor-pointer font-semibold text-primaryColor">
              View Event
            </span>
          </div>
        </Link>
      </div>
      <hr className="my-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
      <div className="flex w-11/12 justify-between">
        <div className="flex flex-col gap-6">
          <div>
            <div className="font-semibold">Email</div>
            <div className={`${styles.content}`}>
              {email || "No Email Available"}
            </div>
          </div>
          <div>
            <div className="font-semibold">Task(s)</div>
            <div>
              {props?.registration?.tasks?.length > 0
                ? props?.registration?.tasks?.join(", ")
                : "No Tasks Available"}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="font-semibold">Phone</div>
            <div className={`${styles.content}`}>
              {props?.event?.eventParent?.eventContactPhone ||
                "No Phone Number Available"}
            </div>
          </div>
          <div>
            <div className="font-semibold">Date</div>
            <div className={`${styles.content}`}>
              {new Date(props?.event?.date).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              }) || "No Date Available"}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <div className="font-semibold">Minors</div>
              <div className={`${styles.content}`}>
                {props.registration.minors.length > 0 ? "Yes" : "No"}
              </div>
            </div>
            <div>
              <div className="font-semibold">Availability</div>
              {props?.event?.eventParent?.maxVolunteers ? (
                <div className={`${styles.content}`}>
                  {Math.max(
                    0,
                    props?.event?.eventParent?.maxVolunteers - regCount
                  )}{" "}
                  / {props?.event?.eventParent?.maxVolunteers} Spots Remaining
                </div>
              ) : (
                "Not Available"
              )}
            </div>
            <div className="flex-grow"></div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="font-semibold">Start Time</div>
            <div className={`${styles.content}`}>
              {props?.event?.eventParent?.startTime
                ? new Date(
                    `1970-01-01T${props.event.eventParent.startTime}`
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Not Available"}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="font-semibold">End Time</div>
            <div className={`${styles.content}`}>
              {props?.event?.eventParent?.endTime
                ? new Date(
                    `1970-01-01T${props.event.eventParent.endTime}`
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Not Available"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center">
        {props.registration.approved == "pending" ? (
          <div className="flex flex-row gap-2">
            <BoGButton
              text={"Approve"}
              className="bg-primaryColor font-semibold hover:bg-secondaryColor"
              onClick={handleApprove}
            />
            <BoGButton
              text={"Deny"}
              className="!border-none bg-transparent font-semibold !text-red-600 hover:bg-transparent hover:text-red-700"
              onClick={handleDeny}
            />
          </div>
        ) : (
          <div className="flex flex-row gap-2">
            <BoGButton
              text={`${
                props.registration.approved == "approved"
                  ? "Approved"
                  : "Approve"
              }`}
              avaliable={false}
              className={`font-semibold hover:bg-secondaryColor ${
                props.registration.approved !== "approved"
                  ? "cursor-default !border-none bg-transparent !text-gray-400"
                  : "cursor-default bg-secondaryColor !text-gray-800"
              }`}
            />
            <BoGButton
              text={`${
                props.registration.approved == "denied" ? "Denied" : "Deny"
              }`}
              avaliable={false}
              className={`!border-none bg-transparent font-semibold hover:bg-transparent hover:text-red-700
                  ${
                    props.registration.approved !== "denied"
                      ? "cursor-default bg-transparent !text-gray-400"
                      : "cursor-default bg-secondaryColor !text-red-800"
                  }`}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

RegistrationCard.propTypes = {
  registration: PropTypes.object,
  regCount: PropTypes.number,
  event: PropTypes.object,
};

export default RegistrationCard;
