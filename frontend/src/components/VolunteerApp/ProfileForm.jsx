import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { Form, FormField, NextButton, Header } from '../Forms';

const validation = Yup.object().shape({
  bio: Yup.object().shape({
    first_name: Yup.string()
      .min(2, 'Too Short!')
      .max(70, 'Too Long!')
      .required('Required'),
    last_name: Yup.string()
      .min(2, 'Too Short!')
      .max(70, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    phone_number: Yup.string()
      .matches(/^((?!_).)*$/, 'Invalid phone number')
      .required('Required'),
    date_of_birth: Yup.date()
      .max(new Date(), `Invalid date of birth`)
      .required('Required'),
    street_address: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    state: Yup.string()
      .max(2, 'Please use 2 letter abbreviation')
      .required('Required'),
    zip_code: Yup.string()
      .matches(/^[0-9]{5}$/, 'Invalid zipcode')
      .required('Required')
  })
});

const defaultValues = {
  bio: {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: new Date().toISOString().substring(0, 10),
    street_address: '',
    city: '',
    state: '',
    zip_code: ''
  }
};

const PersonalInfoForm = ({ initValues, onSubmit, ...props }) => {
  const values = { bio: { ...defaultValues.bio, ...initValues.bio } };
  const submit = formData => {
    const tz = new Date().toISOString().substring(10);
    formData.bio.date_of_birth = new Date(`${formData.bio.date_of_birth}${tz}`);
    onSubmit(formData);
  };

  return (
    <Form initialValues={values} validationSchema={validation} onSubmit={submit} {...props}>
      <Header>Personal Information</Header>
      <FormField label="First Name" name="bio.first_name" placeholder="Jane" />
      <FormField label="Last Name" name="bio.last_name" placeholder="Smith" />
      <FormField label="Email" name="bio.email" type="email" placeholder="jane.smith@gmail.com" />
      <FormField
        label="Phone Number"
        type="tel"
        name="bio.phone_number"
        placeholder="(000)000-0000"
      />
      <FormField
        label="Date of Birth"
        type="date"
        name="bio.date_of_birth"
        placeholder="MM/DD/YYYY"
      />
      <FormField label="Street Address" name="bio.street_address" placeholder="123 Maple St" />
      <FormField label="City" name="bio.city" placeholder="Atlanta" />
      <FormField label="State" name="bio.state" placeholder="GA" />
      <FormField label="Zipcode" name="bio.zip_code" placeholder="30313" />
      <NextButton />
    </Form>
  );
};

PersonalInfoForm.propTypes = {
  initValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default PersonalInfoForm;
