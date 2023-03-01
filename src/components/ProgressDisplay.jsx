import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import { Label, TextInput } from "flowbite-react";
import "flowbite-react";
import { useState } from "react";
import { getHours } from "../screens/Stats/User/hourParsing";

const ProgressDisplay = (props) => {
  let level = "Bronze";
  let num = 0;
  let outOf = 1;

  if (props.type == "Events") {
    if (props.attendance.length > 1) {
      level = "Silver";
      outOf = 3;
    } else if (props.attendance.length > 3) {
      level = "Gold";
      outOf = 5;
    }
    num = props.attendance.length;
  } else {
    let add = 0;
    outOf = 10;
    for (let i = 0; i < props.attendance.length; i++) {
      if (props.attendance[i].timeCheckedOut != null) {
        add += getHours(
          props.attendance[i].timeCheckedIn.slice(11, 16),
          props.attendance[i].timeCheckedOut.slice(11, 16)
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
    <div className="border-2 rounded-md mr-12 ml-12 p-4 bg-white">
      <Label class="text-black-800 text-xl font-semibold">{props.header}</Label>
      <div className="flex flex-nowrap items-end">
        <img src={"/images/Hours Earned - " + level + ".png"}></img>
        <div className="flex flex-nowrap font-semibold items-center">
          <p className="pl-12 text-xl">{num}</p>
          <p className="pl-2 text-md font-semibold text-slate-600">/ {outOf}</p>
          <p className="pl-2 text-md font-semibold text-slate-600">
            {props.type}
          </p>
        </div>
      </div>
      <div className="mt-2 w-full h-2.5 dark:bg-slate-300 rounded-sm">
        <div
          className={`bg-green-600 h-2.5 rounded-full w-[${
            (num * 100) / outOf
          }%]`}
        ></div>
      </div>
    </div>
  );
};

ProgressDisplay.propTypes = {
  type: PropTypes.string.isRequired,
  attendance: PropTypes.object.isRequired,
  header: PropTypes.string.isRequired,
};

export default ProgressDisplay;
