import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

class VolunteerEventDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  Registration(register, unregister, allEvents) {
    this.allVolunteers = allEvents.volunteers;
    console.log("volunteer id's" + this.allVolunteers);
    console.log('user id' + this.props.user);
    console.log(
      'checking volunteer registration:' +
        this.allVolunteers.find(val => (val === this.props.user ? true : false))
    );
    if (this.allVolunteers.find(val => val === this.props.user)) {
      return (
        <Button bsStyle="primary" active onClick={() => unregister()}>
          Unregister
        </Button>
      );
    }
    return (
      <Button bsStyle="primary" active onClick={() => register()}>
        Register
      </Button>
    );
  }

  render() {
    return (
      <div>
        <p>
          <b>Date:</b> {new Date(this.props.event.date).toDateString()}
        </p>
        <p>
          <b>Location:</b> {this.props.event.location}
        </p>
        <p>
          <b>Contact:</b> {this.props.event.contact}
        </p>
        <p>
          <b>Description:</b> {this.props.event.description}
        </p>
        <p>
          <b>Volunteers:</b>{' '}
          {this.props.event.volunteers.length === 0 && <span>No Volunteers Registered</span>}
        </p>
        {this.Registration(this.props.signUp, this.props.unregister, this.props.allVolunteers)}
      </div>
    );
  }
}

VolunteerEventDetails.propTypes = {
  event: PropTypes.object,
  signUp: PropTypes.func
};

export default VolunteerEventDetails;
