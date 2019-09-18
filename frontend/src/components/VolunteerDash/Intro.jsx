import React, { Component } from 'react';
import styles from '../../styles/Home.module.css';

class Intro extends Component {
  render() {
    return (
      <div>
        <div className={styles.title}>
          <h1>Volunteer Portal</h1>
        </div>
        <div className={styles.description}>
          <div className={styles.descriptionInner}>
            <h1>Thank you for your interest in volunteering with us!</h1>
            <div className={styles.descriptionInnerInner}>
              <p>
                You can volunteer to help us with a specific project, event, going to the homeless
                shelters with us or helping us out around the office. Whatever it is, you are
                guaranteed to leave with a full heart and ear-to-ear smile!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Intro;
