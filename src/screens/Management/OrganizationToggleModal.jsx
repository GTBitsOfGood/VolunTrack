import { Button, Modal } from "flowbite-react";
import React from "react";
import PropTypes from "prop-types";
import { toggleStatus } from "../../actions/queries";

const OrganizationToggleModal = (props) => {
  const handleSubmit = () => {
    toggleStatus(props.organizationId);
    props.onClose();
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
        <h3 className="font-family-sans pb-4 text-xl font-semibold">
          {props.status ? "Deactivate " : "Activate "} the platform
        </h3>
        <p>
          By clicking the confirm button, this volunteer management platform
          will become{props.status ? " inactive " : " active "}immediately. Are
          you sure you want to confirm?
        </p>
      </Modal.Body>
      <Modal.Footer className="flex justify-center">
        <Button className="bg-primary" onClick={handleSubmit}>
          Confirm
        </Button>
        <Button
          className="border-primary bg-white text-primary"
          onClick={props.onClose}
        >
          Cancel
        </Button>
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
