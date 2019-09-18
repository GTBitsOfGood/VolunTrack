import React from 'react';
import { Formik, Form as FForm } from 'formik';
import styles from '../../styles/Form.module.css';

const Form = props => (
  <Formik {...props}>
    <FForm className={styles.form}>{props.children}</FForm>
  </Formik>
);

export default Form;
