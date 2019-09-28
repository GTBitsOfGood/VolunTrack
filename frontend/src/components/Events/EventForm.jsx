import React from 'react';
import { render } from 'react-dom';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';

const formikEnhancer = withFormik({
    validationSchema: Yup.object().shape({
        eventName: Yup.string()
            .min(2, "The event name should be longer")
            .required('Event name is required.'),
        eventDate: Yup.date()
            .min(new Date(), "Invalid date of event")
            .required('Required'),
        eventLocation: Yup.string()
            .required('Required'),
        eventDescription: Yup.string()
            .min(5, "More description, please")
            .required('Required'),
        eventContact: Yup.string()
            .min(2, "Contact name should be longer")
            .required('Required'),
        maxVolunteers: Yup.number()
            .min(1, "At least one volunteer")
            .required('Required'),
        eventLink: Yup.string()
            .required('Required'),
        backgroundCheck: Yup.string()
    }),

    mapPropsToValues: ({ event }) => ({
        ...event,
    }),
    handleSubmit:
    ,
    displayName: 'MyForm',
});

const InputFeedback = ({ error }) =>
    error ? <div className="input-feedback">{error}</div> : null;

const Label = ({ error, className, children, ...props }) => {
    return (
        <label className="label" {...props}>
            {children}
        </label>
    );
};

const TextInput = ({ type, id, label, error, value, onChange, className, ...props }) => {
    const classes = classnames(
        'input-group',
        {
            'animated shake error': !!error,
        },
        className
    );
    return (
        <div className={classes}>
            <Label htmlFor={id} error={error}>
                {label}
            </Label>
            <input
                id={id}
                className="text-input"
                type={type}
                value={value}
                onChange={onChange}
                {...props}
            />
            <InputFeedback error={error} />
        </div>
    );
};
const MyForm = props => {
    const {
        values,
        touched,
        errors,
        dirty,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting,
    } = props;
    return (
        <form onSubmit={handleSubmit}>
            <TextInput
                id="eventName"
                type="text"
                label="Event"
                placeholder=""
                error={touched.eventName && errors.eventName}
                value={values.eventName}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="eventDate"
                type="date"
                label="Date"
                placeholder="MM/DD/YY"
                error={touched.eventDate && errors.eventDate}
                value={values.eventDate}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="eventLocation"
                type="text"
                label="Location"
                placeholder="Location"
                error={touched.eventLocation && errors.eventLocation}
                value={values.eventLocation}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="eventDescription"
                type="text"
                label="Description"
                placeholder="brief description"
                error={touched.eventDescription && errors.eventDescription}
                value={values.eventDescription}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="eventContact"
                type="text"
                label="Contact"
                placeholder="John"
                error={touched.eventContact && errors.eventContact}
                value={values.eventContact}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="maxVolunteers"
                type="number"
                label="Max Volunteers"
                placeholder=">0"
                error={touched.maxVolunteers && errors.maxVolunteers}
                value={values.maxVolunteers}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="eventLink"
                type="text"
                label="Link"
                placeholder="please check your link"
                error={touched.eventLink && errors.eventLink}
                value={values.eventLink}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="backgroundcheck"
                type="text"
                label="Background Check"
                placeholder=""
                error={touched.backgroundcheck && errors.backgroundcheck}
                value={values.backgroundcheck}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <button
                type="button"
                className="outline"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
            >
                Reset
            </button>
            <button type="submit" disabled={isSubmitting}>
                Submit
            </button>
            <DisplayFormikState {...props} />
        </form>
    );
};

const MyEnhancedForm = formikEnhancer(MyForm);