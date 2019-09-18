import React from 'react';
import { Field, ErrorMessage } from 'formik';
import MaskedInput from 'react-text-mask';
import { Input } from 'reactstrap';

import styles from '../../styles/Form.module.css';

const phoneNumberMask = [
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/
];

const FormField = props => (
  <div className={styles.flex_field}>
    <label className={styles.label}>{props.label}</label>
    {props.type !== 'tel' ? (
      <Field
        className={styles.label}
        {...props}
        render={({ field }) => <Input {...field} {...props} />}
      />
    ) : (
      <Field
        {...props}
        className={styles.label}
        render={({ field }) => (
          <MaskedInput
            {...field}
            mask={phoneNumberMask}
            placeholder={props.placeholder}
            render={(ref, props2) => <Input innerRef={ref} {...props2} />}
          />
        )}
      />
    )}
    <ErrorMessage component="div" className={styles.error} name={props.name} />
  </div>
);

export default FormField;
