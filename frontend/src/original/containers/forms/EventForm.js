import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Control, Form, Errors } from 'react-redux-form';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import { bindActionCreators } from 'redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
const isValidDate = require('is-valid-date');

// Local Components
import { onCreateEvent } from '../../actions/events';
import Text from '../../components/inputs/Text';
import Textarea from '../../components/inputs/Textarea';

import '../../assets/stylesheets/ItemDisplay.css';

class EventForm extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.props.swal({
        title: 'Login Failed!',
        type: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  render() {
    return (
      <Col md={6} mdOffset={3}>
        <h1 style={{ textAlign: 'center' }}>Create New Volunteering Event</h1>
        <Form model="forms.event" onSubmit={v => console.log(v)}>
          <Control
            required
            component={Text}
            model=".name"
            label="Event Name"
            type="text"
            placeholder="Event Name"
            errors={{
              isRequired: val => !val
            }}
          />
          <Errors
            className="errors"
            model=".name"
            show="focus"
            messages={{
              isRequired: 'Please enter the name of the event'
            }}
          />
          <Control
            required
            component={Text}
            model=".date"
            label="Event Date"
            type="date"
            errors={{
              isRequired: val => !val || !isValidDate(val)
            }}
          />
          <Errors
            className="errors"
            model=".date"
            show="focus"
            messages={{
              isRequired: 'Please enter a date'
            }}
          />
          <Control
            required
            component={Text}
            model=".location"
            label="Event Location"
            type="text"
            placeholder="Event Location"
            errors={{
              isRequired: val => !val || !(val.length >= 5)
            }}
          />
          <Errors
            className="errors"
            model=".location"
            show="focus"
            messages={{
              isRequired: 'Please enter a location'
            }}
          />
          <Control
            required
            component={Textarea}
            model=".description"
            label="Event Description"
            type="text"
            placeholder="Event Description"
            errors={{
              isRequired: val => !val
            }}
          />
          <Errors
            className="errors"
            model=".description"
            show="focus"
            messages={{
              isRequired: 'Please enter a description'
            }}
          />
          <Control
            required
            component={Text}
            model=".contact"
            label="Event Contact"
            type="text"
            placeholder="Event Contact"
            errors={{
              isRequired: val => !val
            }}
          />
          <Errors
            className="errors"
            model=".contact"
            show="focus"
            messages={{
              isRequired: 'Please enter a contact'
            }}
          />
          <Control
            required
            component={Text}
            model=".max_volunteers"
            label="Maximum Number of Volunteers"
            type="text"
            min={1}
            placeholder="Maximum number of Volunteers"
            errors={{
              isRequired: val => !val
            }}
          />
          <Errors
            className="errors"
            model=".max_volunteers"
            show="focus"
            messages={{
              isRequired: 'Please enter a maximum number of volunteers'
            }}
          />
          <Control
            required
            component={Text}
            model=".link"
            label="Link to Sign Up"
            type="text"
            min={1}
            placeholder="https://signup.com/client/invitation2/secure/12345/false#/invitation"
            errors={{
              isRequired: val => !val
            }}
          />
          <Errors
            className="errors"
            model=".link"
            show="focus"
            messages={{
              isRequired: 'Please enter an event link'
            }}
          />
          <Control
            component={Text}
            model=".additional_background_check"
            label="Additional Background Check Information"
            type="text"
            placeholder="Email BackgroundCheck@HomelessShelter.com saying you want to volunteer"
          />

          <Button bsStyle="primary" type="submit" onClick={this.props.onCreateEvent}>
            Create New Event
          </Button>
          <ReduxSweetAlert />
        </Form>
      </Col>
    );
  }
}

EventForm.propTypes = {
  onCreateEvent: PropTypes.func,
  error: PropTypes.bool,
  swal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    error: state.auth.loginFailed
  };
}

function mapDispatchToProps(dispatch) {
  return Object.assign(
    {},
    { swal: bindActionCreators(swal, dispatch) },
    { close: bindActionCreators(close, dispatch) },
    { onCreateEvent: () => dispatch(onCreateEvent()) }
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventForm);
