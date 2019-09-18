import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { Form, FormField, Checkbox, NextButton, BackButton, Header, Text } from '../Forms';

const validation = Yup.object().shape({
  criminal: Yup.object().shape({
    felony: Yup.boolean(),
    sexual_violent: Yup.boolean(),
    drugs: Yup.boolean(),
    driving: Yup.boolean(),
    none: Yup.boolean().when(['sexual_violent', 'drugs', 'driving'], {
      is: (first, second, third) => !(first || second || third),
      then: Yup.boolean().oneOf([true], 'If no other boxes apply, check this box.')
    }),
    explanation: Yup.string().when(['sexual_violent', 'drugs', 'driving'], {
      is: (first, second, third) => first || second || third,
      then: Yup.string()
        .required('Required')
        .min(45, 'Please add more detail.')
    })
  })
});

const defaultValues = {
  criminal: {
    felony: false,
    sexual_violent: false,
    drugs: false,
    driving: false,
    none: false,
    explanation: ''
  }
};

const CriminalForm = ({ initValues, onBack, ...props }) => {
  const values = { criminal: { ...defaultValues.criminal, ...initValues.criminal } };
  return (
    <Form initialValues={values} validationSchema={validation} {...props}>
      <Header>Criminal History</Header>
      <Text bold>Please indicate if you have been convicted of any of the following.</Text>
      <Checkbox name="criminal.felony" value="Any felony crime? " />
      <Checkbox
        name="criminal.sexual_violent"
        value="Any crime involving a sexual offense, an assault or the use of a weapon? "
      />
      <Checkbox
        name="criminal.drugs"
        value="Any crime involving the use, possession, or the furnishing of drugs or hypodermic syringes?"
      />
      <Checkbox
        name="criminal.driving"
        value="Reckless driving, operating a motor vehicle while under the influence, or driving to endanger?"
      />
      <Checkbox name="criminal.none" value="No criminal record." />
      <FormField
        name="criminal.explanation"
        type="textarea"
        label="If you indicated yes to any of the above please explain and list when the offense occured."
      />
      <div style={{ display: 'flex' }}>
        <BackButton onClick={onBack} />
        <NextButton />
      </div>
    </Form>
  );
};

CriminalForm.propTypes = {
  initValues: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default CriminalForm;
