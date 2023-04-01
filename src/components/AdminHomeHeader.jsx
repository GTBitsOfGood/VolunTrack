import PropTypes from "prop-types";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("apexcharts"), { ssr: false });
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import DateDisplayComponent from "./DateDisplay";

const AdminHomeHeader = (props) => {
  let events = 0;
  let volunteers = 0;
  let firstDate = "";
  for (let i = 0; i < props.data.length; i++) {
    let splitDate = new Date(props.data[i].date).toDateString().split(" ");
    let final = splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
    if (final === props.dateString) {
      events++;
      volunteers += props.data[i].volunteers.length;
    }
    if (i === props.data.length - 1) {
      let split = props.data[i].date;
      firstDate =
        split.substring(5, 7) +
        "/" +
        split.substring(8, 10) +
        "/" +
        split.substring(0, 4);
    }
  }

  const borderColor = "#374151";
  const labelColor = "#93ACAF";
  const opacityFrom = 0;
  const opacityTo = 0;

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
        opacityFrom,
        opacityTo,
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
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
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
      data: [
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][8],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][9],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][10],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][11],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][0],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][1],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][2],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][3],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][4],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][5],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][6],
        props.eventChart[0] === undefined ? 0 : props.eventChart[0][7],
      ],
    },
    {
      name: "Hours",
      data: [
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][8],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][9],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][10],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][11],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][0],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][1],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][2],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][3],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][4],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][5],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][6],
        props.eventChart[1] === undefined ? 0 : props.eventChart[1][7],
      ],
    },
    {
      name: "Attendance",
      data: [
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][8],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][9],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][10],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][11],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][0],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][1],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][2],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][3],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][4],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][5],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][6],
        props.eventChart[2] === undefined ? 0 : props.eventChart[2][7],
      ],
    },
  ];

  return (
    <div className="flex-column">
      <p className="font-weight-bold mx-2 mt-2 pb-3 text-2xl">Overview</p>
      <div className="flex">
        <div className="flex-column">
          <div className="flex-column m-2 flex rounded-lg bg-white p-4">
            <h3 className="font-weight-bold pb-3 text-lg">
              {"Today's Overview"}
            </h3>
            <div className="flex">
              <div>
                <DateDisplayComponent
                  date={props.dateString}
                  version={"Primary"}
                />
              </div>
              <div className="flex-column flex">
                <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                  <p className="pl-2 text-2xl">{events}</p>
                  <p className="text-md pl-2 text-slate-600">
                    {" "}
                    Upcoming Events
                  </p>
                </div>
                <hr className="my-2 mx-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                  <p className="pl-2 text-2xl">{volunteers}</p>
                  <p className="text-md pl-2 text-slate-600"> Volunteers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-column m-2 flex rounded-lg bg-white p-4">
            <div className="flex items-center pb-3">
              <h3 className="font-weight-bold text-lg">Total Data</h3>
              <p className="pl-2 text-sm text-slate-600">
                {`(${firstDate} to now)`}
              </p>
            </div>
            <div className="flex-column flex">
              <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                <p className="pl-2 text-2xl">{props.numEvents}</p>
                <p className="text-md pl-2 text-slate-600"> Events</p>
              </div>
              <hr className="my-1 mx-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
              <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                <p className="pl-2 text-2xl">{props.attend}</p>
                <p className="text-md pl-2 text-slate-600"> Attendance</p>
              </div>
              <hr className="my-1 mx-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
              <div className="flex flex-nowrap items-center font-semibold text-primaryColor">
                <p className="pl-2 text-2xl">{props.hours}</p>
                <p className="text-md pl-2 text-slate-600"> Hours</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mixed-chart m-2 rounded-lg bg-white">
          {typeof window !== "undefined" && (
            <Chart width={600} options={options} series={series} type="area" />
          )}
        </div>
      </div>
    </div>
  );
};

AdminHomeHeader.propTypes = {
  data: PropTypes.object.isRequired,
  dateString: PropTypes.string.isRequired,
  numEvents: PropTypes.object.isRequired,
  attend: PropTypes.object.isRequired,
  hours: PropTypes.object.isRequired,
  eventChart: PropTypes.array.isRequired,
  hourChart: PropTypes.array.isRequired,
  attendChart: PropTypes.array.isRequired,
};

export default AdminHomeHeader;
