import { Form as FForm, Formik } from "formik";
import PropTypes from "prop-types";
import { useState } from "react";
import { Col, ModalBody, ModalFooter, Row } from "reactstrap";
import styled from "styled-components";
import BoGButton from "../../../../components/BoGButton";
import InputField from "../../../../components/Forms/InputField";
import {
  getAttendance,
  updateAttendance,
} from "../../../../queries/attendances";
import * as SForm from "../../../sharedStyles/formStyles";
import { timeValidator } from "../eventHelpers";

const Styled = {
  Form: styled(FForm)``,
  ErrorMessage: styled.div.attrs({
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

  Col: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
  `,
  ModalBody: styled(ModalBody)`
    margin-left: 1.5rem;
    margin-right: -10px;
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
};

const EditEventStatsForm = ({ toggle, stat }) => {
  const [attendance, setAttendance] = useState(stat);

  const onSubmitEditEvent = (values, setSubmitting) => {
    const editedStat = {
      ...attendance,
    };
    editedStat.checkinTime = new Date(
      new Date(
        new Date(editedStat.checkinTime) -
          new Date().getTimezoneOffset() * 60_000
      )
        .toISOString()
        .slice(0, 11) + values.checkin
    ).toISOString();
    const checkoutDate = editedStat.checkoutTime
      ? editedStat.checkoutTime
      : editedStat.checkinTime;
    editedStat.checkoutTime = new Date(
      new Date(new Date(checkoutDate) - new Date().getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 11) + values.checkout
    ).toISOString();
    setSubmitting(true);
    updateAttendance(stat._id, editedStat).then((response) => {
      setAttendance(response.data.attendance);
    });
    toggle();
  };

  return (
    attendance && (
      <Formik
        initialValues={{
          name: stat.volunteerName,
          email: stat.volunteerEmail,
          checkin: new Date(attendance.checkinTime).toLocaleTimeString("en-GB"),
          checkout: new Date(attendance.checkoutTime).toLocaleTimeString(
            "en-GB"
          ),
        }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmitEditEvent(values, setSubmitting);
        }}
        validationSchema={timeValidator}
      >
        {({ handleSubmit, isValid, isSubmitting, errors, touched, values }) => {
          return (
            <>
              <Styled.ModalBody>
                <Styled.Form>
                  <SForm.FormGroup>
                    <Row>
                      <Col>
                        <Row
                          style={{
                            padding: "5px",
                            fontWeight: "bold",
                            color: "gray",
                          }}
                        >
                          Event Information
                        </Row>
                        <Row>
                          <Styled.Col>
                            <InputField
                              name="name"
                              label="Name"
                              disabled={true}
                            />
                          </Styled.Col>
                          <Styled.Col>
                            <InputField
                              name="email"
                              label="Email"
                              disabled={true}
                            />
                          </Styled.Col>
                          <Styled.Col>
                            <InputField
                              name="checkin"
                              label="Check In Time"
                              type="time"
                            />
                          </Styled.Col>
                          <Styled.Col>
                            <InputField
                              name="checkout"
                              label="Check Out Time"
                              type="time"
                            />
                          </Styled.Col>
                        </Row>
                      </Col>
                    </Row>
                  </SForm.FormGroup>
                </Styled.Form>
              </Styled.ModalBody>
              <ModalFooter>
                <BoGButton text="Cancel" onClick={toggle} outline={true} />
                <BoGButton
                  text="Update"
                  onClick={handleSubmit}
                  disabled={!isValid || isSubmitting}
                />
              </ModalFooter>
            </>
          );
        }}
      </Formik>
    )
  );
};

EditEventStatsForm.propTypes = {
  stat: PropTypes.object,
  toggle: PropTypes.func.isRequired,
};

export default EditEventStatsForm;
