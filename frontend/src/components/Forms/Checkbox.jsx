import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FormGroup, CustomInput } from 'reactstrap';

import styles from '../../styles/Form.module.css';

const Checkbox = props => (
  <div className={styles.flex_field}>
    <Field name={props.name}>
      {({ field, form }) => (
        <FormGroup className={styles.flex_field} check>
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
    <ErrorMessage component="div" className={styles.error} name={props.name} />
  </div>
);

export default Checkbox;
