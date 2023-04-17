import { Modal } from "flowbite-react";
import PropTypes from "prop-types";
import BoGButton from "../../components/BoGButton";
import { toggleOrganizationActive } from "../../queries/organizations";

const OrganizationToggleModal = (props) => {
  const handleSubmit = () => {
    toggleOrganizationActive(props.organizationId).then(() => props.onClose());
  };

  return (
    <Modal
      show={props.open}
      dismissible={true}
      onClose={props.onClose}
      popup={true}
    >
      <Modal.Header />
      <Modal.Body className="text-center">
        <h3 className="pb-4 text-xl font-semibold">
          {props.status ? "Deactivate " : "Activate "} the organization
        </h3>
        <p>
          By clicking the confirm button, this volunteer management platform
          will become{props.status ? " inactive " : " active "}immediately. Are
          you sure you want to confirm?
        </p>
      </Modal.Body>
      <Modal.Footer className="flex justify-center gap-2">
        <BoGButton onClick={props.onClose} text="Cancel" outline={true} />
        <BoGButton onClick={handleSubmit} text="Confirm" />
      </Modal.Footer>
    </Modal>
  );
};

OrganizationToggleModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  status: PropTypes.bool,
  organizationId: PropTypes.string,
};

export default OrganizationToggleModal;
