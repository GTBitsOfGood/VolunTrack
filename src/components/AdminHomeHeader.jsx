import PropTypes from "prop-types";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("apexcharts"), { ssr: false });
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import DateDisplayComponent from "./DateDisplay";
import { getHours } from "../screens/Stats/User/hourParsing";

const AdminHomeHeader = (props) => {
  let todaysEvents = 0;
  let todaysRegistrations = 0;
  let firstDate = "";

  let eventData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let hoursData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let attendanceData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  let eventTotal = 0;
  let hoursTotal = 0;
  let attendanceTotal = 0;

  if (props.events.length > 0) {
    let split = props.events[0].date;
    firstDate =
      split.substring(5, 7) +
      "/" +
      split.substring(8, 10) +
      "/" +
      split.substring(0, 4);
  }

  for (let i = 0; i < props.events.length; i++) {
    let date = new Date(props.events[i].date);
    let splitDate = new Date(
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    )
      .toDateString()
      .split(" ");
    let final = splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
    if (final === props.dateString) {
      todaysEvents++;
      todaysRegistrations += props.registrations.filter(
        (r) => r.eventId === props.events[i]._id
      ).length;
    }
    let month = parseInt(props.events[i].date.slice(5, 7)) - 1;
    eventData[month] += 1;
    eventTotal += 1;
  }
  for (let i = 0; i < props.attendances.length; i++) {
    let month = parseInt(props.attendances[i].checkinTime.slice(5, 7)) - 1;
    if (props.attendances[i].checkoutTime != null) {
      let duration = getHours(
        props.attendances[i].checkinTime.slice(11, 16),
        props.attendances[i].checkoutTime.slice(11, 16)
      );
      hoursData[month] += Math.round(duration * 100) / 100;
      hoursTotal += duration;
    }
    attendanceData[month] += 1;
    attendanceTotal += 1;

    // rounding
    for (let i = 0; i < hoursData.length; i++) {
      hoursData[i] = Math.round(hoursData[i] * 100) / 100;
    }
    hoursTotal = Math.round(hoursTotal * 100) / 100;
  }

  const borderColor = "#374151";
  const labelColor = "#93ACAF";

  const options = (ApexCharts.ApexOptions = {
    stroke: {
      curve: "smooth",
    },
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      foreColor: labelColor,
      toolbar: {
        show: false,
      },
    },
    colors: ["#0284c7", "#15803d", "#991b1b"],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0,
        opacityTo: 0,
        type: "vertical",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    grid: {
      show: true,
      borderColor: borderColor,
      strokeDashArray: 1,
      padding: {
        left: 35,
        bottom: 15,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#ffffff",
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        color: borderColor,
      },
      axisTicks: {
        color: borderColor,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 10,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: [labelColor],
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          xaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
  });
  const series = [
    {
      name: "Events",
      data: eventData,
    },
    {
      name: "Hours",
      data: hoursData,
    },
    {
      name: "Attendance",
      data: attendanceData,
    },
  ];

  return (
    <div className="w-full flex-col md:w-auto">
      <p className="font-weight-bold mt-2 text-2xl">Overview</p>
      <div className="mb-2 flex flex-col md:flex-row">
        <div className="flex-column">
          <div className="flex-column mb-2 flex rounded-lg bg-grey p-4 md:mr-2">
            <h3 className="font-weight-bold pb-3 text-lg">
              {"Today's Overview"}
            </h3>
            <div className="flex">
              <div>
                <DateDisplayComponent date={Date.now()} version={"Primary"} />
              </div>
              <div className="flex-column flex">
                <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                  <p className="mb-0 pl-2 text-2xl">{todaysEvents}</p>
                  <p className="text-md mb-0 pl-2 text-slate-600">
                    {`Scheduled Event${todaysEvents !== 1 ? "s" : ""}`}
                  </p>
                </div>
                <hr className="mx-2 my-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                  <p className="mb-0 pl-2 text-2xl">{todaysRegistrations}</p>
                  <p className="text-md mb-0 pl-2 text-slate-600">
                    {`Volunteer${todaysRegistrations !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-column mt-2 flex rounded-lg bg-grey p-4 md:mr-2">
            <div className="flex items-center pb-3">
              <h3 className="font-weight-bold text-lg">Total Data</h3>
              <p className="pl-2 text-sm text-slate-600">
                {`(${firstDate} to now)`}
              </p>
            </div>
            <div className="flex-column flex">
              <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                <p className="mb-0 pl-2 text-2xl">{eventTotal}</p>
                <p className="text-md mb-0 pl-2 text-slate-600"> Events</p>
              </div>
              <hr className="mx-2 my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
              <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                <p className="mb-0 pl-2 text-2xl">{attendanceTotal}</p>
                <p className="text-md mb-0 pl-2 text-slate-600"> Attendance</p>
              </div>
              <hr className="mx-2 my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
              <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                <p className="mb-0 pl-2 text-2xl">{hoursTotal}</p>
                <p className="text-md mb-0 pl-2 text-slate-600"> Hours</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mixed-chart my-[0.5rem] h-60 w-full rounded-lg bg-grey p-2 md:my-0 md:h-auto md:w-[600px]">
          {typeof window !== "undefined" && (
            <Chart
              width={"100%"}
              height={"100%"}
              options={options}
              series={series}
              type="area"
              className="bg-white pb-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};

AdminHomeHeader.propTypes = {
  events: PropTypes.array.isRequired,
  attendances: PropTypes.array.isRequired,
  registrations: PropTypes.array.isRequired,
  dateString: PropTypes.string.isRequired,
};

export default AdminHomeHeader;
