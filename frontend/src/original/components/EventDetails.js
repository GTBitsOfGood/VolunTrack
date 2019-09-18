import React from 'react';
import PropTypes from 'prop-types';

class EventDetails extends React.Component {
  constructor(props) {
    super(props);
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
          {this.props.event.volunteers.length === 0 ? (
            <span>No Volunteers Registered</span>
          ) : (
            this.props.event.volunteers.length
          )}
        </p>
        {this.props.event.link && (
          <p>
            {' '}
            <b>Sign-Up Link:</b>
            <a
              target="_blank"
              href={
                this.props.event.link.includes('http://') ||
                this.props.event.link.includes('https://')
                  ? this.props.event.link
                  : 'http://' + this.props.event.link
              }
            >
              {' '}
              {this.props.event.link}
            </a>
          </p>
        )}
        {this.props.event.additional_background_check && (
          <p>
            {' '}
            <b>Additional Background Check Info: </b>
            {this.props.event.additional_background_check}
          </p>
        )}

        {this.props.user.bio.role == 'volunteer' ? (
          this.props.event.volunteers.includes(this.props.user._id) ? (
            <button type="button" onClick={() => this.props.unSignUp()}>
              {' '}
              Cancel Sign Up{' '}
            </button>
          ) : (
            <button type="button" onClick={() => this.props.onSignUp()}>
              {' '}
              Sign Up{' '}
            </button>
          )
        ) : (
          ''
        )}
      </div>
    );
  }
}

EventDetails.propTypes = {
  event: PropTypes.object,
  onSignUp: PropTypes.func,
  unSignUp: PropTypes.func
};

export default EventDetails;
