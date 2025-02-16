import { Card, ToggleSwitch } from "flowbite-react";
import PropTypes from "prop-types";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import Text from "../../components/Text";
import BoGButton from "../../components/BoGButton";
import { editRegistration } from "../../queries/registrations";
import Link from "next/link";
import { useRouter } from "next/router";


const RegistrationCard = (props) => {
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
    <Card className="w-full !border-none !shadow-none !bg-[#F9F9F9]">
      <div className="flex justify-center">
        <div className="flex flex-row items-center">
          <div className="mr-2 font-semibold">Contact Name: </div>
					<div className="mr-2">{props?.event?.eventParent?.pocName || "No Name Available"}</div>
        </div>
				
        <div className="grow" />
				<div className="flex flex-rows items-center">
					<div className="mr-2 font-semibold">	
						Requested Date
					</div>
					<div className="mr-2">
					{new Date(props?.registration?.createdAt).toLocaleDateString("en-US", {
						month: "2-digit",
						day: "2-digit",
						year: "2-digit",
					}) || "No Date Available"}
					</div>
				</div>
      </div>
			<div className="flex flex-row items-center gap-4">
				<Link href={`/volunteers`} className="flex flex-row items-center">
					<div className="flex flex-row">
						<UserCircleIcon className="h-6 w-6 text-primaryColor cursor-pointer" />
						<span className="font-semibold flex text-primaryColor ml-2 cursor-pointer">User Profile</span>
					</div>
					
				</Link>
				<Link href={`/events/${props?.event?._id}/register`} className="flex flex-row items-center">
					<div className="flex flex-row">
						<CalendarDaysIcon className="h-6 w-6 text-primaryColor cursor-pointer" />
						<span className="font-semibold flex text-primaryColor ml-2 cursor-pointer">View Event</span>
					</div>
				</Link>
			</div>
      <hr className="my-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
      <div className="flex justify-between w-11/12">
        <div className="flex flex-col justify-between gap-6">
					<div>
						<div className="font-semibold">Email</div>
						<div>{props?.event?.eventParent?.eventContactEmail || "No Email Available"}</div>
					</div>
					<div>
						<div className="font-semibold">Event</div>
						<div>{props?.event?.eventParent?.title || "No Title Available"}</div>
					</div>
					<div>
						<div className="font-semibold">Task(s)</div>
						<div>
							{props?.event?.eventParent.tasks.length > 0 ? (
								props?.event?.eventParent.tasks.join(', ')
							) : (
								"No Tasks Available"
							)}
						</div>
					</div> 
        </div>

        <div className="flex flex-col justify-between gap-6">
					<div>
						<div className="font-semibold">Phone</div>
						<div>{props?.event?.eventParent?.eventContactPhone || "No Phone Number Available"}</div>
					</div>
					<div>
						<div className="font-semibold">Date</div>
							<div>
								{new Date(props?.event?.date).toLocaleDateString("en-US", {
									month: "2-digit",
									day: "2-digit",
									year: "2-digit"
								}) || "No Date Available"}
							</div>
						</div>
					<div>
						<div className="font-semibold">Availability</div>
						{(props?.event?.eventParent?.maxVolunteers && props?.regCount) ? (
							<div>{Math.max(0, (props?.event?.eventParent?.maxVolunteers - props?.regCount))} / {props?.event?.eventParent?.maxVolunteers}</div>
						) : (
							"Not Available"
						)}
						
					</div>
        </div>

        <div className="flex flex-col justify-between gap-6">
					<div className="flex flex-col justify-between h-full gap-6">
						<div>
							<div className="font-semibold">Minors</div>
							<div>{props.registration.minors.length > 0 ? "Yes" : "No"}</div>
						</div>
						
						<div className="flex flex-row gap-10">
							<div className="flex flex-col">
								<div className="font-semibold">Start Time</div>
								{props?.event?.eventParent?.startTime ? (
									new Date(`1970-01-01T${props.event.eventParent.startTime}`).toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
										hour12: true,
									})
								) : (
									"Not Available"
								)}
							</div>
							<div className="flex flex-col">
								<div className="font-semibold">End Time</div>
								{props?.event?.eventParent?.endTime ? (
									new Date(`1970-01-01T${props.event.eventParent.endTime}`).toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
										hour12: true,
									})
								) : (
									"Not Available"
								)}
							</div>
						</div>

						<div className="flex-grow"></div>
					</div>
        </div>
				
				

      </div>
			<div className="flex flex-row items-center">
						{props.registration.approved == "pending" ? (
							<div className="flex flex-row gap-2">
								<BoGButton
								  text={"Approve"}
									className="font-semibold bg-primaryColor hover:bg-secondaryColor" 
									onClick={handleApprove}
								/>
								<BoGButton
									text={"Deny"}
									className="!text-red-600 bg-transparent font-semibold !border-none hover:bg-transparent hover:text-red-700"
									onClick={handleDeny}
								/>
							</div>
						) : (
							<div className="flex flex-row gap-2">
								<BoGButton text={props.registration.approved} className="font-semibold hover:bg-secondaryColor bg-secondaryColor" />
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
