import PropTypes from "prop-types";
import { Label, Progress } from "flowbite-react";
import "flowbite-react";
import { getHours } from "../screens/Stats/User/hourParsing";

const ProgressDisplay = ({
  className,
  type,
  attendance,
  header,
  medalDefaults,
}) => {
  let level = "Bronze";
  let num = 0;
  let outOf;

  if (type === "Events") {
    outOf = medalDefaults.eventSilver;
    if (attendance.length > 15) {
      level = "Gold";
      outOf = medalDefaults.eventGold * 2;
    } else if (attendance.length > 10) {
      level = "Silver";
      outOf = medalDefaults.eventGold;
    }
    num = attendance.length;
  } else {
    let add = 0;
    outOf = medalDefaults.hoursSilver;
    for (let i = 0; i < attendance.length; i++) {
      if (attendance[i].checkoutTime != null) {
        add += getHours(
          attendance[i].checkinTime.slice(11, 16),
          attendance[i].checkoutTime.slice(11, 16)
        );
      }
    }
    if (add >= 15) {
      level = "Gold";
      outOf = medalDefaults.hoursGold * 2;
    } else if (add >= 10) {
      level = "Silver";
      outOf = medalDefaults.hoursGold;
    }
    num = Math.round(add * 10) / 10;
  }

  return (
    <div className={"rounded-md bg-grey px-12 py-4 " + (className || "")}>
      <Label class="text-black-800 text-xl font-semibold">{header}</Label>
      <div className="flex flex-nowrap items-center">
        <img
          className="h-16"
          src={"/images/Hours Earned - " + level + ".png"}
          alt="medal"
        />
        <div className="flex flex-nowrap items-center font-semibold">
          <p className="pl-6 text-2xl">{num}</p>
          <p className="text-md pl-2 text-slate-600">/ {outOf}</p>
          <p className="text-md pl-2 text-slate-600">{type}</p>
        </div>
      </div>
      <Progress className="mt-4" progress={(num / outOf) * 100} color="green" />
    </div>
  );
};

ProgressDisplay.propTypes = {
  type: PropTypes.string.isRequired,
  attendance: PropTypes.object.isRequired,
  header: PropTypes.string.isRequired,
  medalDefaults: PropTypes.object.isRequired,
};

export default ProgressDisplay;
