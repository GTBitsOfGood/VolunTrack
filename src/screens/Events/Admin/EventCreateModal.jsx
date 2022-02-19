import React from "react";
import styled from "styled-components";
import { Modal, ModalHeader } from "reactstrap";
import { Form as FForm, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import EventFormModal from "./EventFormModal"
import variables from "../../../design-tokens/_variables.module.scss";

const Styled = {
  Form: styled(FForm)``,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: red;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  `,
  ModalHeader: styled(ModalHeader)`
    border-color: transparent;
    .standard {
      color: ${variables["dark"]};
      font-weight: 700;
      border-bottom: 2px solid ${variables["dark"]};
      padding-right: 4.5rem;
      padding-left: 4.5rem;
      margin-left: 5rem;
      padding-top: 4rem;
      margin-right: 0px;
      display: inline;
    }
    .org-event {
      color: ${variables["input-color"]};
      border-bottom: 2px solid #E9E9E9;
      padding-right: 4.5rem;
      padding-left: 4.5rem;
      display: inline;
    }
    div {
      margin-top: 2rem;
    }
  `,
};

const EventCreateModal = ({ open, toggle }) => {

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static" size="lg">
      <Styled.ModalHeader toggle={toggle}>
        <div>
        <p class = "standard">Standard Event</p>
        <p class = "org-event">Organization Event</p>
        </div>
      </Styled.ModalHeader>
      <EventFormModal toggle={toggle} event={null}></EventFormModal>
    </Modal>
  );
};
EventCreateModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventCreateModal;
