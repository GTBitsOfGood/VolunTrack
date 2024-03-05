import { Formik } from "formik";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import BoGButton from "../../../components/BoGButton";
import StatsTable from "../../../components/StatsTable";
import InputField from "../../../components/Forms/InputField";
import ProgressDisplay from "../../../components/ProgressDisplay";
import { getAttendances } from "../../../queries/attendances";
import { getUser } from "../../../queries/users";
import { filterAttendance } from "../helper";
import Text from "../../../components/Text";

const StatDisplay = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");

  if (!userId) {
    const { data: session } = useSession();
    userId = session.user._id;
  }
  const { data: session } = useSession();
  let user = session.user;

  const onSubmitValues = (values, setSubmitting) => {
    let offset = new Date().getTimezoneOffset();

    if (!values.startDate) {
      setStartDate("undefined");
    } else {
      let start = new Date(values.startDate);
      start.setMinutes(start.getMinutes() - offset);
      setStartDate(start);
    }

    if (!values.endDate) {
      setEndDate("undefined");
    } else {
      let end = new Date(values.endDate);
      end.setMinutes(end.getMinutes() - offset);
      setEndDate(end);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAttendances({ userId, organizationId: user.organizationId })
      .then((result) => {
        if (result?.data?.attendances) {
          const filteredAttendance = filterAttendance(
            result.data.attendances,
            startDate,
            endDate
          );
          setAttendance(filteredAttendance);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    getUser(userId).then((response) => {
      if (response.data.user)
        setName(
          `${response.data.user.firstName} ${response.data.user.lastName}'s`
        );
    });
  }, [startDate, endDate]);

  return (
    <React.Fragment>
      <div className="flex-column mx-auto mt-2 flex w-5/6 items-start gap-1 p-10">
        <Text
          className="pb-10"
          text={name + " Volunteer Statistics"}
          type="header"
        />
        <div className="my-2 flex w-full flex-col py-4 md:w-auto md:flex-row md:items-end md:space-x-4">
          <ProgressDisplay
            type="Events"
            attendance={attendance}
            header="Events Attended"
            medalDefaults={session.medalDefaults}
          />
          <ProgressDisplay
            type="Hours"
            attendance={attendance}
            header="Hours Earned"
            medalDefaults={session.medalDefaults}
          />
        </div>

        <Formik
          initialValues={{}}
          onSubmit={(values, { setSubmitting }) => {
            onSubmitValues(values, setSubmitting);
          }}
          render={({ handleSubmit }) => (
            <div className="my-2 flex w-full flex-col py-4 md:w-auto md:flex-row md:items-end md:space-x-4">
              <InputField label="From" name="startDate" type="datetime-local" />
              <InputField label="To" name="endDate" type="datetime-local" />
              <BoGButton
                className="my-3 w-full bg-primaryColor hover:bg-hoverColor"
                text="Search"
                onClick={() => {
                  handleSubmit();
                }}
              />
            </div>
          )}
        />
        <div className="w-full">
          <Text text="Volunteer History" type="subheader" />
          <Text
            text={`${attendance.length} events`}
            className="my-2 text-primaryColor"
          />
          <StatsTable attendances={attendance} isIndividualStats={true} />
        </div>
      </div>
    </React.Fragment>
  );
};
StatDisplay.propTypes = {
  userId: PropTypes.string,
  onlyAchievements: PropTypes.bool,
};

export default StatDisplay;
