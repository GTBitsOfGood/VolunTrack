import React from 'react';
import '../assets/stylesheets/ItemDisplay.css';
import PropTypes from 'prop-types';

import EventList from './EventList';
import VolunteersList from './VolunteersList';
class LeftPane extends React.Component {
  constructor(props) {
    super(props);

    this.isEvent = this.props.view === 'Event' ? true : null;
    this.isVolunteer = this.props.view === 'Volunteer' ? true : null;
  }

  render() {
    return (
      <div className="parentItem">
        <h1>Item Page</h1>
        {this.isEvent && (
          <EventList
            items={this.props.itemList}
            updateCurrentEvent={this.props.updateCurrentEvent}
            view={this.props.view}
          />
        )}
        {this.isVolunteer && (
          <VolunteersList
            items={this.props.itemList}
            updateCurrentVolunteer={this.props.updateCurrentVolunteer}
            view={this.props.view}
          />
        )}
      </div>
    );
  }
}

LeftPane.propTypes = {
  itemList: PropTypes.array,
  updateCurrentEvent: PropTypes.func,
  updateCurrentVolunteer: PropTypes.func,
  view: PropTypes.string
};

export default LeftPane;
