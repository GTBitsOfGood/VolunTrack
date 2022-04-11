import React from "react";
import styled from "styled-components";
import { Modal, ModalHeader } from "reactstrap";
import { Form as FForm, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import EventFormModal from "./EventFormModal";
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
    .org-event {
      color: ${variables["input-color"]};
      border-bottom: 2px solid #e9e9e9;
      padding-right: 3.5rem;
      padding-left: 3.5rem;
      display: inline;
    }
  `,
  HeaderText: styled.p`
    color: ${variables["dark"]};
    font-weight: 900;
    font-size: 1.2em;
    border-bottom: 2px solid ${variables["dark"]};
    padding-right: 3.5rem;
    padding-left: 2rem;
    margin-left: 5rem;
    margin-right: 5rem;
    text-align: center;
    display: inline;
  `,
};

const EventCreateModal = ({ open, toggle }) => {
  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static" size="xl">
      <Styled.ModalHeader toggle={toggle}></Styled.ModalHeader>
      <Styled.HeaderText>
        <p>Standard Event</p>
        {/* <p class = "org-event">Organization Event</p> */}
      </Styled.HeaderText>
      <EventFormModal toggle={toggle} event={null}></EventFormModal>
    </Modal>
  );
};
EventCreateModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventCreateModal;
