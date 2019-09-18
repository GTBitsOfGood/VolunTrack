import React from 'react';
import styles from '../../styles/FluidImage.module.css';

const FluidImage = ({ src, alt, ...props }) => (
  <div className={styles.wrapper} {...props}>
    <img className={styles.img} src={src} alt={alt} />
  </div>
);

export default FluidImage;
