import { Formik } from "formik";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import BoGButton from "../../../components/BoGButton";
import InputField from "../../../components/Forms/InputField";
import Loading from "../../../components/Loading";
import { getAttendances } from "../../../queries/attendances";
import AdminAuthWrapper from "../../../utils/AdminAuthWrapper";
import { getHours } from "../../Stats/User/hourParsing";
import Text from "../../../components/Text";

const Stats = () => {
  const {
    data: { user },
  } = useSession();

  const [numEvents, setNumEvents] = useState(0);
  const [attend, setAttend] = useState(0);
  const [hours, setHours] = useState(0);
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRefresh();
  }, [startDate, endDate]);

  const onRefresh = async () => {
    // grab the events
    setLoading(true);
    // if (result?.data?.events) setNumEvents(result.data.events.length);
    getAttendances({ organizationId: user.organizationId }, startDate, endDate)
      .then((result) => {
        let attendances = result.data.attendances;
        const uniqueVolunteers = [
          ...new Set(attendances.map((attendance) => attendance.userId)),
        ];
        setAttend(uniqueVolunteers.length);
        const uniqueEvents = [
          ...new Set(attendances.map((attendance) => attendance.eventId)),
        ];
        setNumEvents(uniqueEvents.length);
        let hours = 0;
        attendances.forEach((attendance) => {
          if (attendance.checkoutTime)
            hours += getHours(
              attendance.checkinTime.slice(11, 16),
              attendance.checkoutTime.slice(11, 16)
            );
        });
        setHours(hours);

        // let computedStats = [];
        // var totalAttendance = 0;
        // var totalHours = 0;
        // for (let event of result.data.events) {
        //   let stat = stats.data.find((s) => s._id === event._id);
        //   if (stat) {
        //     totalAttendance += stat.uniqueUsers.length;
        //     totalHours += stat.minutes / 60.0;
        //
        //     computedStats.push({
        //       _id: event._id,
        //       title: event.eventParent.title,
        //       date: event.date,
        //       startTime: event.eventParent.startTime,
        //       endTime: event.eventParent.endTime,
        //       attendance: stat.uniqueUsers.length,
        //       hours: Math.round((stat.minutes / 60.0) * 100) / 100,
        //     });
        //   }
        // }
        //
        // setAttend(totalAttendance);
        // setHours(Math.round(totalHours * 100) / 100);
        // setComputedStats(computedStats);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  return (
    <div className="align-center mx-auto mt-6 flex w-5/6 flex-col items-center">
      <Text text="Event Attendance Summary" type="header" className="my-4" />
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          onSubmitValues(values, setSubmitting);
        }}
        render={({ handleSubmit }) => (
          <div className="flex items-center gap-4">
            <InputField label="From" name="startDate" type="datetime-local" />
            <InputField label="To" name="endDate" type="datetime-local" />
            <BoGButton
              className="mt-2 bg-primaryColor hover:bg-hoverColor"
              text="Search"
              onClick={() => {
                handleSubmit();
              }}
            />
          </div>
        )}
      />
      {loading && <Loading />}

      {!loading && (
        <div className="align-center my-8 flex items-center gap-16">
          <div className="flex-column flex items-center">
            <Text text="Unique Events:" type="subheader" />
            <Text text={numEvents} type="subheader" />
          </div>
          <div className="flex-column flex items-center">
            <Text text="Unique Volunteers:" type="subheader" />
            <Text text={attend} type="subheader" />
          </div>
          <div className="flex-column flex items-center">
            <Text text="Total Hours Worked:" type="subheader" />
            <Text text={hours} type="subheader" />
          </div>
        </div>
      )}

      {/* TODO: do the aggregation of events and stats for this to work*/}
      {/*{!loading && (*/}
      {/*  <div className="mt-2">*/}
      {/*    <EventTable events={computedStats} isVolunteer={false} />*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export default AdminAuthWrapper(Stats);
