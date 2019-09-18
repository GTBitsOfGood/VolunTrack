import React from 'react';
import PropTypes from 'prop-types';

import InlineVolunteer from './InlineVolunteer';
import '../assets/stylesheets/ItemDisplay.css';

class VolunteersList extends React.Component {
  constructor(props) {
    super(props);
  }

  renderItem() {
    return (
      <div className="ItemList">
        {this.props.items.map(item =>
          item.role === 'pending' ? (
            <InlineVolunteer
              key={item._id}
              first_name={item.first_name}
              last_name={item.last_name}
              street_address={item.street_address}
              city={item.city}
              state={item.state}
              phone_number={item.phone_number}
              id={item._id}
              updateCurrentVolunteer={this.props.updateCurrentVolunteer}
            />
          ) : (
            <InlineVolunteer
              key={item._id}
              first_name={item.first_name}
              last_name={item.last_name}
              street_address={item.street_address}
              city={item.city}
              state={item.state}
              phone_number={item.phone_number}
              id={item._id}
              updateCurrentVolunteer={this.props.updateCurrentVolunteer}
            />
          )
        )}
      </div>
    );
  }

  render() {
    return <div>{this.renderItem()}</div>;
  }
}

VolunteersList.propTypes = {
  items: PropTypes.array,
  updateCurrentVolunteer: PropTypes.func
};

export default VolunteersList;
