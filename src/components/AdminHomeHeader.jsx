import PropTypes from "prop-types";
const AdminHomeHeader = (props) => {
  return (
    <h3 className="mx-20 justify-center">
      This is where you should add the top part of the admin home page
    </h3>
  );
};

AdminHomeHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AdminHomeHeader;
