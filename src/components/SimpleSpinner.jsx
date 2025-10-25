import PropTypes from "prop-types";

const SimpleSpinner = ({ size = "1rem" }) => (
  <div className="flex items-center justify-center" style={{ fontSize: size }}>
    <div
      className="animate-spin rounded-full border-2 border-gray-300 border-t-white"
      style={{ width: "2em", height: "2em" }}
    />
  </div>
);

export default SimpleSpinner;

SimpleSpinner.propTypes = {
  size: PropTypes.string,
};
