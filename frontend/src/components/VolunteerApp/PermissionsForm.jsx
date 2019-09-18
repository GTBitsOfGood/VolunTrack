import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { Form, FormField, Checkbox, SubmitButton, BackButton, Header, Text } from '../Forms';

const validation = Yup.object().shape({
  permissions: Yup.object().shape({
    comments: Yup.string(),
    reference: Yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
    personal_image: Yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
    email_list: Yup.boolean(),
    signature: Yup.string().required('Required')
  })
});

const defaultValues = {
  permissions: {
    comments: '',
    reference: false,
    personal_image: false,
    email_list: false,
    signature: ''
  }
};

const PermissionsForm = ({ initValues, onBack, ...props }) => {
  const values = { permissions: { ...defaultValues.permissions, ...initValues.permissions } };
  return (
    <Form initialValues={values} validationSchema={validation} {...props}>
      <Header>Anything else?</Header>
      <FormField
        type="textarea"
        name="permissions.comments"
        label="Is there anything else we should know about you? Any questions, comments, or concerns?"
      />
      <Header>Permissions</Header>
      <Text bold>drawchange has my permission to:</Text>
      <Checkbox name="permissions.reference" value="Verify the reference I have provided" />
      <Checkbox
        name="permissions.personal_image"
        value="Include my name and/or picture in drawchange promotional materials, newspapers, TV, radio, brochures, videos, website(s), etc"
      />
      <Checkbox
        name="permissions.email_list"
        value="Add me to their mailing list. (We only send 1 email per month and never share your email address) "
      />
      <br />
      <Text>
        By submitting this application, I affirm that the facts set forth in it are true and
        complete. I understand that if I am accepted as a volunteer, any false statements,
        omissions, or other misrepresentations made by me on this application may result in my
        immediate dismissal.
      </Text>
      <FormField
        name="permissions.signature"
        label="Please enter your full legal name here, to confirm agreement."
      />
      <div style={{ display: 'flex' }}>
        <BackButton onClick={onBack} />
        <SubmitButton />
      </div>
    </Form>
  );
};

PermissionsForm.propTypes = {
  initValues: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default PermissionsForm;
