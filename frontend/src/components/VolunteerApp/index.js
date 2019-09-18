import React, { Component } from 'react';
import { Row, Col, Progress } from 'reactstrap';
import axios from 'axios';

import Step0 from './ProfileForm';
import Step1 from './VolunteerInfoForm';
import Step2 from './ShortAnswerForm';
import Step3 from './EmploymentInfoForm';
import Step4 from './ReferenceForm';
import Step5 from './ICEForm';
import Step6 from './CriminalForm';
import Step7 from './PermissionsForm';
import FluidImage from './FluidImage';

import images from '../../images/volunteer_app';
import { PendingVolunteer } from '..';

export default class VolunteerApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      data: {},
      submitted: false
    };
  }
  steps = [Step0, Step1, Step2, Step3, Step4, Step5, Step6, Step7];

  postApp = _ => {
    console.log('we submitted');
    console.log(this.state.data);
    console.log(this.props.user._id)

    axios
    //patch request to user.id to update proper asset 
    //custom patch check in users.js 
      .put(`/api/users/${this.props.user._id}`, this.state.data)
      .then(res => {
        console.log('Success', res);
        this.setState({ submitted: true });
      })
      .catch(er => console.log('ERROR: ', er));
    // TODO Add error handling
  };

  onSubmit = formData => {
    if (this.state.step < this.steps.length) {
      this.setState(({ step, data }) => ({ step: step + 1, data: { ...data, ...formData } }));
    } else if (this.state.step === this.steps.length) {
      this.setState(({ data }) => ({ data: { ...data, ...formData } }), this.postApp);
    }
  };

  onBack = _ => this.setState(({ step }) => ({ step: step - 1 }));

  render() {
    const right_styles =
      window.innerWidth > 575 ? { margin: '65px 0px 10px 10px' } : { margin: '10px' };
    const CurrentStep = this.steps[this.state.step - 1];
    const currentImage = images[this.state.step - 1];
    const percent = Math.ceil(((this.state.step - 1) / this.steps.length) * 100) + 10;
    return (
      <div>
        {this.state.submitted ? (
          <PendingVolunteer />
        ) : (
          <Row>
            <Col xs={12} sm={4} md={{ size: 4, offset: 1 }}>
              <div style={right_styles}>
                <FluidImage src={currentImage} alt="volunteer app image" />
                <div className="text-center" style={{ marginTop: '10px' }}>
                  {percent}% Done
                </div>
                <Progress value={percent} color="success" />
              </div>
            </Col>
            <Col
              xs={12}
              sm={8}
              md={6}
              style={{ height: '90vh', overflow: 'hidden', overflowY: 'scroll' }}
            >
              <CurrentStep
                initValues={this.state.data}
                onBack={this.onBack}
                onSubmit={this.onSubmit}
                user={this.props.user}
              />
            </Col>
          </Row>
        )}
      </div>
    );
  }
}
