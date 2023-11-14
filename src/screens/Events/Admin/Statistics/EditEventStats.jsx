import { Modal, ModalHeader } from "reactstrap";
import styled from "styled-components";

import PropTypes from "prop-types";
import variables from "../../../../design-tokens/_variables.module.scss";
import EditEventStatsForm from "./EditEventStatsForm";

const Styled = {
  ModalHeader: styled(ModalHeader)`
    border-color: transparent;
    p {
      color: ${variables["dark"]};
      font-weight: 700;
      margin-top: 2rem;
      margin-left: 4.5rem;
      padding-right: 3.5rem;
      padding-left: 3.5rem;
      border-bottom: 2px solid ${variables["dark"]};
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

const EditEventStats = ({ open, toggle, attendance }) => {
  return (
    <Modal isOpen={open} toggle={toggle} size="xl">
      <Styled.ModalHeader toggle={toggle} />
      <Styled.HeaderText>
        <p>Edit Entry</p>
      </Styled.HeaderText>
      <EditEventStatsForm toggle={toggle} stat={attendance} />
    </Modal>
  );
};
EditEventStats.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  attendance: PropTypes.object,
};

export default EditEventStats;
