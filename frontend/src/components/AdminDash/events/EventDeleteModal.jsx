import React from 'react';
import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik';
import * as SForm from '../shared/formStyles';
import PropTypes from 'prop-types';
import { string, object, number, date } from 'yup';
import {deleteEvent, editEvent} from '../queries';
import EventEditModal from "./EventEditModal";

const Styled = {
    Form: styled(FForm)``,
    ErrorMessage: styled(ErrorMessage).attrs({
        component: 'span'
    })`
    ::before {
      content: '*';
    }
    color: red;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  `
};

const EventValidator = object().shape({
    name: string()
        .trim()
        .required(),
    date: date().required(),
    location: string()
        .trim()
        .required(),
    description: string()
        .trim()
        .required(),
    contact_phone: string().trim(),
    contact_email: string()
        .email()
        .trim(),
    external_links: string()
        .url()
        .trim(),
    max_volunteers: number()
        .positive()
        .required()
});

const EventDeleteModal = ({ open, toggle, event }) => {
    return (
        <Modal isOpen={open} toggle={toggle} backdrop="static">
            <ModalHeader toggle={toggle}>Delete Event</ModalHeader>
            <Formik
                initialValues={{
                    name: (event) ? event.name: '',
                    date: (event) ? event.date: '',
                    location: (event) ? event.location: '',
                    description: (event) ? event.description: '',
                    contact_phone: (event) ? event.contact_phone: '',
                    contact_email: (event) ? event.email: '',
                    max_volunteers: (event) ? event.max_volunteers: 0,
                    external_links: (event) ? event.external_links: []
                }}
                onSubmit={(values, { setSubmitting }) => {
                    const event = {
                        ...values
                    };
                    setSubmitting(true);
                    deleteEvent(event);
                    toggle();
                        // .then(() => toggle())
                        // .catch(console.log)
                        // .finally(() => setSubmitting(false));
                }}
                validationSchema={EventValidator}
                render={({ handleSubmit, isValid, isSubmitting,values, setFieldValue}) => (
                    <React.Fragment>
                        <ModalBody>
                            <Styled.Form>
                                <SForm.FormGroup>
                                    <SForm.Label>Name</SForm.Label>
                                    <Styled.ErrorMessage name="name" />
                                    <Field name="name">{({ field }) => <SForm.Input {...field} type="text" />}</Field>
                                </SForm.FormGroup>
                            </Styled.Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </React.Fragment>
                )}
            />
        </Modal>
    );
};

EventDeleteModal.propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func
};
export default EventDeleteModal;