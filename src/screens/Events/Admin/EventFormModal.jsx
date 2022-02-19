import React from "react";
import styled from "styled-components";
import { Col, Row } from "reactstrap";
import { ModalBody, ModalFooter, Button } from "reactstrap";
import { Formik, Form as FForm, Field, ErrorMessage } from "formik";
import * as SForm from "../../sharedStyles/formStyles";
import PropTypes from "prop-types";
import { eventValidator } from "./eventHelpers";
import { editEvent } from "../../../actions/queries";
import { createEvent } from "../../../actions/queries";
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
    Col: styled(Col)`
      padding: 10px;
    `,
    ModalBody: styled(ModalBody)`
      margin-left: 8rem;
    `
  };


const EventFormModal = ({ toggle, event }) => {
    const emptyStringField = "";

    const onSubmitCreateEvent = (values, setSubmitting) => {
        const event = {
            ...values,
        };
        setSubmitting(true);
        createEvent(event)
            .then(() => toggle())
            .catch(console.log)
            .finally(() => setSubmitting(false));
    };

    const onSubmitEditEvent = (values, setSubmitting) => {
        const editedEvent = {
            ...values,
            _id: event._id,
        };
        setSubmitting(true);
        editEvent(editedEvent);
        toggle();
    };

    const containsExisitingEvent = (event) => {
        return event;
    }

    return (
        <Formik
        initialValues={{
            title: containsExisitingEvent(event) ? event.name : emptyStringField,
            date: containsExisitingEvent(event) ? event.date.split("T")[0] : emptyStringField, // strips timestamp
            startTime: containsExisitingEvent(event) ? event.time : emptyStringField,
            endTime: containsExisitingEvent(event) ? event.time : emptyStringField,
            address: containsExisitingEvent(event) ? event.address : emptyStringField,
            city: containsExisitingEvent(event) ? event.city : emptyStringField,
            zip: containsExisitingEvent(event) ? event.zip : emptyStringField,
            volunteers: containsExisitingEvent(event) ? event.volunteers : emptyStringField,
            description: containsExisitingEvent(event) ? event.description : emptyStringField,
        }}
        onSubmit={(values, { setSubmitting }) => {
            containsExisitingEvent(event) ? onSubmitEditEvent(values, setSubmitting) : onSubmitCreateEvent(values,  setSubmitting);
        }}
        validationSchema={eventValidator}
        render={({
            handleSubmit,
            isValid,
            isSubmitting,
            values,
            setFieldValue,
            handleBlur,
        }) => (
            <React.Fragment>
            <Styled.ModalBody>
                <Styled.Form>
                <SForm.FormGroup>
                    <Row>
                    <Styled.Col>
                        <SForm.Label>Event Title</SForm.Label>
                        <Styled.ErrorMessage name="title" />
                        <Field name="title">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                        </Field>
                    </Styled.Col>
                    <Styled.Col>
                        <SForm.Label>Date and Time</SForm.Label>
                        <Styled.ErrorMessage name="date" />
                        <Field name="date">
                        {({ field }) => <SForm.Input {...field} type="date" />} 
                        </Field>
                    </Styled.Col>
                    <Styled.Col>
                        <SForm.Label></SForm.Label>
                        <Field name="startTime">
                        {({ field }) => <SForm.Input {...field} type="time" />}
                        </Field>
                        <SForm.Label></SForm.Label>
                        <Field name="endTime">
                        {({ field }) => <SForm.Input {...field} type="time" />}
                        </Field>
                    </Styled.Col>
                    </Row>
                    <Row>
                    <Styled.Col>
                        <SForm.Label>Address</SForm.Label>
                        <Styled.ErrorMessage name="address" />
                        <Field name="address">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                        </Field>
                    </Styled.Col>
                    <Styled.Col>
                        <SForm.Label>City</SForm.Label>
                        <Styled.ErrorMessage name="city" />
                        <Field name="city">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                        </Field>
                    </Styled.Col>
                    <Styled.Col>
                        <SForm.Label>Zipcode</SForm.Label>
                        <Styled.ErrorMessage name="zip" />
                        <Field name="zip">
                        {({ field }) => <SForm.Input {...field} type="number" />}
                        </Field>
                    </Styled.Col>
                    </Row>
                    <Row>
                    <Styled.Col>
                        <SForm.Label>Max Number of Volunteers</SForm.Label>
                        <Styled.ErrorMessage name="volunteers" />
                        <Field name="volunteers">
                        {({ field }) => <SForm.Input {...field} type="number" />}
                        </Field>
                    </Styled.Col>
                    </Row>
                    <Row>
                    <Styled.Col>
                        <SForm.Label>Description</SForm.Label>
                        <Styled.ErrorMessage name="description" />
                        <Field name="description">
                        {({ field }) => <SForm.Input {...field} type="textarea" />}
                        </Field>
                    </Styled.Col>
                    </Row>
                </SForm.FormGroup>
                </Styled.Form>
            </Styled.ModalBody>
            <ModalFooter>
                <Button 
                color="secondary" 
                onClick={toggle}
                style={{backgroundColor: 'transparent', borderColor: 'transparent', color: variables["event-text"]}}
                >
                Cancel
                </Button>
                <Button
                color="primary"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                style={{backgroundColor: variables["button-pink"], borderColor: variables["button-pink"], marginLeft: '4rem'}}
                >
                Create Event
                </Button>
            </ModalFooter>
            </React.Fragment>
        )}
        />
    );
}

EventFormModal.propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func,
};

export default EventFormModal;