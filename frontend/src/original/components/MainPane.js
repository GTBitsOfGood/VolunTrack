import PropTypes from 'prop-types';
import React from 'react';

import '../assets/stylesheets/ItemDisplay.css';
import EventCreate from './EventCreate';
import Button from 'react-bootstrap/lib/Button';

class MainPane extends React.Component {
  constructor(props) {
    super(props);

    this.isEvent = this.props.view === 'Event' ? true : null;
    this.isVolunteer = this.props.view === 'Volunteer' ? true : null;
    this.isNewEvent = this.props.newEvent === 'NewEvent' ? true : null;
  }

  render() {
    return (
      <div>
        {this.isEvent && this.isNewEvent && <EventCreate />}
        {this.isEvent && !this.isNewEvent && this.props.currentItem
          ? this.props.currentItem._id
          : 'None Selected'}
        {this.isVolunteer && this.props.currentItem ? this.props.currentItem : 'None Selected'}
        {this.isVolunteer && this.props.currentItem ? (
          this.props.currentItem.role === 'pending' ? (
            <Button bsStyle="primary">Approve</Button>
          ) : (
            <Button bsStyle="primary">Remove</Button>
          )
        ) : null}
        {this.isVolunteer && this.props.currentItem ? (
          this.props.currentItem.role === 'volunteer' ? (
            <Button bsStyle="primary">Deny</Button>
          ) : (
            <Button bsStyle="primary">Remove</Button>
          )
        ) : null}
      </div>
    );
  }
}

MainPane.propTypes = {
  newEvent: PropTypes.string,
  currentItem: PropTypes.object,
  view: PropTypes.string
};

export default MainPane;
