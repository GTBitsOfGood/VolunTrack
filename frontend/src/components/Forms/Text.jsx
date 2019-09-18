import React from 'react';
import styles from '../../styles/Form.module.css';

const Subtitle = props => {
  if (props.bold) {
    return (
      <p className={styles.flex_field}>
        <b>{props.children}</b>
      </p>
    );
  }
  return <p className={styles.flex_field}>{props.children}</p>;
};

export default Subtitle;
