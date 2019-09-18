import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { Form, FormField, NextButton, BackButton, Header } from '../Forms';

const validation = Yup.object().shape({
  reference: Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(70, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    phone_number: Yup.string()
      .matches(/^((?!_).)*$/, 'Invalid phone number')
      .required('Required'),
    relationship: Yup.string().required('Required'),
    duration: Yup.string().required('Required')
  })
});

const defaultValues = {
  reference: {
    name: '',
    phone_number: '',
    email: '',
    relationship: '',
    duration: ''
  }
};

const ReferenceForm = ({ initValues, onBack, ...props }) => {
  const values = { reference: { ...defaultValues.reference, ...initValues.reference } };
  return (
    <Form initialValues={values} validationSchema={validation} {...props}>
      <Header>Reference</Header>
      <FormField label="Reference Full Name" name="reference.name" placeholder="Jane Smith" />
      <FormField
        label="Reference Email"
        name="reference.email"
        type="email"
        placeholder="jane.smith@gmail.com"
      />
      <FormField
        label="Reference Phone Number"
        type="tel"
        name="reference.phone_number"
        placeholder="(000)000-0000"
      />
      <FormField
        label="How does this person know you?"
        name="reference.relationship"
        placeholder="Previous Coworker"
      />
      <FormField
        label="How long have you known this person?"
        name="reference.duration"
        placeholder="10 Months"
      />
      <div style={{ display: 'flex' }}>
        <BackButton onClick={onBack} />
        <NextButton />
      </div>
    </Form>
  );
};

ReferenceForm.propTypes = {
  initValues: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ReferenceForm;
