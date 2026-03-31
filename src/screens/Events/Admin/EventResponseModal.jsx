import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import styled from "styled-components";
import variables from "../../../design-tokens/_variables.module.scss";

const Styled = {
  Modal: styled(Modal)`
    border-color: ${(props) =>
      props.$status === "error" ? "#dc3545" : "#28a745"};
    border-width: 1px;
    border-radius: 0.5rem;
  `,
  ModalHeader: styled(ModalHeader)`
    color: ${(props) => (props.$status === "error" ? "#dc3545" : "#28a745")};
    background-color: ${(props) =>
      props.$status === "error" ? "#fff5f5" : "#f6fffa"};
    border-color: transparent;
  `,
  ModalBody: styled(ModalBody)`
    padding-top: 0px;
    padding-bottom: 1.5rem;
    font-size: 1.1em;
    display: flex;
    justify-content: center;
    background-color: ${(props) =>
      props.$status === "error" ? "#fff5f5" : "#f6fffa"};
  `,
};

const EventResponseModal = ({ open, toggle, isError, errorMsg }) => {
  return (
    <Styled.Modal
      $status={isError ? "error" : "success"}
      isOpen={open}
      toggle={toggle}
      backdrop="static"
      size="lg"
    >
      <div>
        <Styled.ModalHeader
          $status={isError ? "error" : "success"}
          toggle={toggle}
        >
          {isError ? "Error!" : "Success!"}
        </Styled.ModalHeader>
        <Styled.ModalBody $status={isError ? "error" : "success"}>
          {isError ? errorMsg : "Event successfully created!"}
        </Styled.ModalBody>
      </div>
    </Styled.Modal>
  );
};
EventResponseModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventResponseModal;
