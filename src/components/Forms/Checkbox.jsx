import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FormGroup, CustomInput } from 'reactstrap';
import styled from 'styled-components';

const ErrorMsg = styled(ErrorMessage)`
  color: red;
`;
const styleFlexField = {
  flexDirection: 'column',
  display: 'flex',
  margin: '5px'
};

const Checkbox = props => (
  <div style={styleFlexField}>
    <Field name={props.name}>
      {({ field, form }) => (
        <FormGroup style={styleFlexField} check>
          <CustomInput
            type="checkbox"
            id={props.name}
            checked={field.value}
            label={props.value}
            onChange={() => form.setFieldValue(props.name, !field.value)}
          />
        </FormGroup>
      )}
    </Field>
    <ErrorMsg component="div" name={props.name} />
  </div>
);

export default Checkbox;
