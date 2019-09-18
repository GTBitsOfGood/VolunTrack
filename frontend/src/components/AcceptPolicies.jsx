import React, { Component } from 'react';

import { Container, Row, Col, Button, Jumbotron } from 'reactstrap';

import styles from '../styles/AcceptPolicies.module.css';

class AcceptPolicies extends Component {
  state = { readVM: false, readCPC: false };
  delay = 10000; // 10 seconds

  handleReadVM = _ => {
    window.open(
      'https://docs.google.com/document/d/14QEpMwgJzjyBX27dfNsbKoxV_VEjF8IwbQGEIadMMOo/edit',
      '_blank'
    );
    setTimeout(_ => this.setState({ readVM: true }), this.delay);
    return false;
  };

  handleReadCPC = _ => {
    window.open(
      'https://docs.google.com/document/d/14QEpMwgJzjyBX27dfNsbKoxV_VEjF8IwbQGEIadMMOo/edit',
      '_blank'
    );
    setTimeout(_ => this.setState({ readCPC: true }), this.delay);
    return false;
  };

  render() {
    const { readVM, readCPC } = this.state;
    const read = readVM && readCPC;
    return (
      <Container>
        <Row>
          <Col lg={{ offset: 2, size: 8 }} md={12}>
            <Jumbotron className={styles.jumbotron}>
              <h1 className="display-3">Congrats!</h1>
              <p className="lead">
                We have reviewed your application and are thrilled to have you join our team!
              </p>
              <hr className="my-2" />
              <p>
                Before you may start volunteering with drawchange, you must read and agree to the
                terms and conditions outlined in the Volunteer Manual and Child Protection Clause.
              </p>
              <p className={styles.mb_0}>
                <Button
                  onClick={this.handleReadVM}
                  className={readVM ? styles.btn_valid : styles.btn_invalid}
                >
                  Read Volunteer Manual
                </Button>
                <Button
                  onClick={this.handleReadCPC}
                  className={readCPC ? styles.btn_valid : styles.btn_invalid}
                >
                  Read Child Protection Clause
                </Button>
              </p>
              <p className="lead">
                <Button
                  disabled={!read}
                  color={read ? 'primary' : 'secondary'}
                  style={{ margin: '5px' }}
                  onClick={this.props.onSubmit}
                >
                  {read ? 'Continue' : 'Please Read the Policies Before Continuing'}
                </Button>
              </p>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AcceptPolicies;
