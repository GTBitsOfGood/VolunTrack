import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { Form, FormField, NextButton, BackButton, Header } from '../Forms';

const validation = Yup.object().shape({
  ice: Yup.object().shape({
    name: Yup.string()
      .min(3, 'Too Short!')
      .max(70, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    phone_number: Yup.string()
      .matches(/^((?!_).)*$/, 'Invalid phone number')
      .required('Required'),
    relationship: Yup.string().required('Required'),
    address: Yup.string().required('Required')
  })
});

const defaultValues = {
  ice: {
    name: '',
    phone_number: '',
    email: '',
    relationship: '',
    address: ''
  }
};

const ICEForm = ({ initValues, onBack, ...props }) => {
  const values = { ice: { ...defaultValues.ice, ...initValues.ice } };
  return (
    <Form initialValues={values} validationSchema={validation} {...props}>
      <Header>Emergency Contact</Header>
      <FormField label="Full Name" name="ice.name" placeholder="Jane Smith" />
      <FormField label="Email" name="ice.email" type="email" placeholder="jane.smith@gmail.com" />
      <FormField
        label="Phone Number"
        type="tel"
        name="ice.phone_number"
        placeholder="(000)000-0000"
      />
      <FormField
        label="Relation to Emergency Contact"
        name="ice.relationship"
        placeholder="Mother"
      />
      <FormField
        label="Emergency Contact Address"
        name="ice.address"
        placeholder="123 Maple St. Atlanta, GA 30308"
      />
      <div style={{ display: 'flex' }}>
        <BackButton onClick={onBack} />
        <NextButton />
      </div>
    </Form>
  );
};

ICEForm.propTypes = {
  initValues: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ICEForm;
