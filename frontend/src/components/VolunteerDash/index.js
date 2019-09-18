import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';

import Intro from './Intro';
import Footer from './Footer';
import AcceptPolicies from '../AcceptPolicies';

import styles from '../../styles/VolunteerDash.module.css';
import { IMAGES } from '../../images/gallery';

export default class VolunteerDashboard extends Component {
  state = {
    hasPolicies: true
  };

  handlePolicies = _ => this.setState({ hasPolicies: true });
  render() {
    return (
      <div>
        {this.state.hasPolicies ? (
          <div>
            <Intro />
            <div className={styles.gallery}>
              <Gallery enableImageSelection={false} maxRows={1} images={IMAGES} />
            </div>
            <Footer />
          </div>
        ) : (
          <AcceptPolicies onSubmit={this.handlePolicies} />
        )}
        )}
      </div>
    );
  }
}
