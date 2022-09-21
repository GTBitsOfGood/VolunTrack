import React, { useState } from "react";
import styled from "styled-components";
import { Modal, ModalHeader, Nav, NavItem, NavLink } from "reactstrap";
import { Form as FForm, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import EventFormModal from "./EventFormModal";
import variables from "../../../design-tokens/_variables.module.scss";
import classnames from "classnames";

const Styled = {
  Form: styled(FForm)``,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: #ef4e79;
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
    font-weight: 700;
    font-size: 1.2em;
    // border-bottom: 2px solid ${variables["dark"]};
    // padding-right: 3.5rem;
    // padding-left: 2rem;
    // margin-left: 5rem;
    // margin-right: 5rem;
    // text-align: center;
    // display: inline;
  `,
  Nav: styled(Nav)`
    padding-left: 1rem;
  `,
};

const EventCreateModal = ({ open, toggle }) => {
  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState("1");

  // Toggle active state for Tab
  const changeTab = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static" size="xl">
      <Styled.ModalHeader toggle={toggle}></Styled.ModalHeader>
      <Styled.Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "1",
            })}
            onClick={() => {
              changeTab("1");
            }}
          >
            {" "}
            <Styled.HeaderText>
              <p
                style={{
                  color: currentActiveTab === "1" ? "#7F1C3B" : "black",
                }}
              >
                Standard Event
              </p>
            </Styled.HeaderText>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "2",
            })}
            onClick={() => {
              changeTab("2");
            }}
          >
            {" "}
            <Styled.HeaderText>
              <p
                style={{
                  color: currentActiveTab === "2" ? "#7F1C3B" : "black",
                }}
              >
                Group Event
              </p>
            </Styled.HeaderText>
          </NavLink>
        </NavItem>
      </Styled.Nav>
      <EventFormModal
        toggle={toggle}
        event={null}
        isGroupEvent={currentActiveTab === "2"}
      ></EventFormModal>
    </Modal>
  );
};
EventCreateModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventCreateModal;
