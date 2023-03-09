import PropTypes from "prop-types";
import { Label, Progress } from "flowbite-react";
import "flowbite-react";
import { getHours } from "../screens/Stats/User/hourParsing";

const ProgressDisplay = ({ type, attendance, header }) => {
  let level = "Bronze";
  let num = 0;
  let outOf = 1;

  if (type === "Events") {
    if (attendance.length > 1) {
      level = "Silver";
      outOf = 3;
    } else if (attendance.length > 3) {
      level = "Gold";
      outOf = 5;
    }
    num = attendance.length;
  } else {
    let add = 0;
    outOf = 10;
    for (let i = 0; i < attendance.length; i++) {
      if (attendance[i].timeCheckedOut != null) {
        add += getHours(
          attendance[i].timeCheckedIn.slice(11, 16),
          attendance[i].timeCheckedOut.slice(11, 16)
        );
      }
    }
    if (add >= 15) {
      level = "Gold";
      outOf = 20;
    } else if (add >= 10) {
      level = "Silver";
      outOf = 15;
    }
    num = Math.round(add * 10) / 10;
  }

  return (
    <div className="ml-18 mr-8 rounded-md border-2 bg-white px-10 py-4">
      <Label class="text-black-800 text-xl font-semibold">{header}</Label>
      <div className="flex flex-nowrap items-end">
        <img src={"/images/Hours Earned - " + level + ".png"} />
        <div className="flex flex-nowrap items-center font-semibold">
          <p className="pl-12 text-2xl">{num}</p>
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
};

export default ProgressDisplay;
