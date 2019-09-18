import React, { Component } from 'react';
import styles from '../../styles/Home.module.css';
import Gallery from 'react-grid-gallery';
import Intro from './Intro';
import Footer from './Footer';
import { IMAGES } from '../../images/gallery';

class Splash extends Component {
  render() {
    return (
      <div>
        <Intro />
        <div className={styles.gallery}>
          <Gallery enableImageSelection={false} maxRows={1} images={IMAGES} />
        </div>
        <Footer onAuth={this.props.onAuth} />
      </div>
    );
  }
}

export default Splash;
