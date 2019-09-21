import React, { Component } from 'react';
import Footer from './Footer';

class Splash extends Component {
  render() {
    return (
      <div>
        <Footer onAuth={this.props.onAuth} />
      </div>
    );
  }
}

export default Splash;
