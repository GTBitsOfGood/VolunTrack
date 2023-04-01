import React from "react";
import PropTypes from "prop-types";

class DateDisplayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { month: "Jan", day: "1" };
  }

  componentDidMount = () => {
    const date = new Date(new Date(this.props.date).getTime() + 86400000); // + 1 day in ms
    const month = date.toLocaleString("default", { month: "short" });
    this.setState({ month: month, day: date.getDate() });
  };

  render() {
    return this.props.version === "Primary" ? (
      <div className="bg-primaryColor mr-2 flex h-16 w-16 flex-col items-center justify-center rounded-md">
        <p className="text-sm leading-none text-white">
          {this.state.month.toUpperCase()}
        </p>
        <p className="mt-1 text-3xl font-bold leading-none text-white">
          {this.state.day}
        </p>
      </div>
    ) : (
      <div className="bg-secondaryColor mr-2 flex h-16 w-16 flex-col items-center justify-center rounded-md">
        <p className="text-primaryColor text-sm leading-none">
          {this.state.month.toUpperCase()}
        </p>
        <p className="text-primaryColor mt-1 text-3xl font-bold leading-none">
          {this.state.day}
        </p>
      </div>
    );
  }
}

export default DateDisplayComponent;

DateDisplayComponent.propTypes = {
  date: PropTypes.object.isRequired,
  version: PropTypes.string.isRequired,
};
