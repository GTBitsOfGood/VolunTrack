import React from "react";
import { Modal } from "flowbite-react";
import PropTypes from "prop-types";
import BoGButton from "./BoGButton";

const BasicModal = (props) => {
  return (
    <Modal
      show={props.open}
      dismissible={true}
      onClose={props.onCancel}
      popup={true}
    >
      <Modal.Header>{props.title}</Modal.Header>
      <Modal.Body className="text-center">
        {props.text && <p>{props.text}</p>}
      </Modal.Body>
      <Modal.Footer className="flex justify-center gap-2">
        <BoGButton
          onClick={props.onCancel}
          text={props.cancelText}
          outline={true}
        />
        <BoGButton onClick={props.onConfirm} text={props.confirmText} />
      </Modal.Footer>
    </Modal>
  );
};

BasicModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  confirmText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default BasicModal;
