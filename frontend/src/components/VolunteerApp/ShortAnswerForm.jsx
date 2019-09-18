import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import { Form, FormField, Checkbox, NextButton, BackButton, Header, Subtitle } from '../Forms';

const validation = Yup.object().shape({
  history: Yup.object().shape({
    volunteer_interest_cause: Yup.string()
      .min(80, 'Please elaborate')
      .required('Required'),
    volunteer_support: Yup.string()
      .min(80, 'Please elaborate')
      .required('Required'),
    volunteer_commitment: Yup.string()
      .min(80, 'Please elaborate')
      .required('Required'),
    previous_volunteer_experience: Yup.string()
      .min(80, 'Please elaborate')
      .required('Required')
  }),
  referral: Yup.object().shape({
    friend: Yup.boolean().required('Required'),
    newsletter: Yup.boolean().required('Required'),
    event: Yup.boolean().required('Required'),
    volunteer_match: Yup.boolean().required('Required'),
    internet: Yup.boolean().required('Required'),
    social_media: Yup.boolean().required('Required')
  })
});

const defaultValues = {
  history: {
    volunteer_interest_cause: '',
    volunteer_support: '',
    volunteer_commitment: '',
    previous_volunteer_experience: ''
  },
  referral: {
    friend: false,
    newsletter: false,
    event: false,
    volunteer_match: false,
    internet: false,
    social_media: false
  }
};

const ShortAnswerForm = ({ initValues, onBack, ...props }) => {
  const values = {
    history: { ...defaultValues.history, ...initValues.history },
    referral: { ...defaultValues.referral, ...initValues.referral }
  };
  return (
    <Form initialValues={values} validationSchema={validation} {...props}>
      <Header>Volunteer Information</Header>
      <FormField
        type="textarea"
        name="history.volunteer_interest_cause"
        label="Why are you interested in volunteering with drawchange?"
      />
      <FormField
        type="textarea"
        name="history.volunteer_support"
        label="What would you need FROM us to support your timely completion of tasks? What supports your productivity? What sorts of recognition do you most value?"
      />
      <FormField
        type="textarea"
        name="history.volunteer_commitment"
        label="What do you do when you realize you cannot keep a commitment?"
      />
      <FormField
        type="textarea"
        name="history.previous_volunteer_experience"
        label="What are your previous volunteer experiences? Please list the organization name, city and state, position and duties. How long you were there?"
      />
      <br />
      <Subtitle>How did you hear about drawchange?</Subtitle>
      <Row>
        <Col xs={6}>
          <Checkbox name="referral.friend" value="Friend" />
          <Checkbox name="referral.newsletter" value="Newsletter" />
          <Checkbox name="referral.event" value="Event" />
        </Col>
        <Col xs={6}>
          <Checkbox name="referral.volunteer_match" value="Volunteer Match" />
          <Checkbox name="referral.internet" value="Internet" />
          <Checkbox name="referral.social_media" value="Social Media" />
        </Col>
      </Row>
      <div style={{ display: 'flex' }}>
        <BackButton onClick={onBack} />
        <NextButton />
      </div>
    </Form>
  );
};

ShortAnswerForm.propTypes = {
  initValues: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ShortAnswerForm;
