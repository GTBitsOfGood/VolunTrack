import React from 'react';
import { Button } from 'reactstrap';
import styles from '../../styles/Form.module.css';

const NextButton = props => (
  <Button className={styles.button} color="primary" type="submit" {...props}>
    Next
  </Button>
);

export default NextButton;
