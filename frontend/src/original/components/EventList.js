import React from 'react';
import PropTypes from 'prop-types';

import InlineEvent from './InlineEvent';
import '../assets/stylesheets/ItemDisplay.css';

const EventList = ({ items, updateCurrentEvent }) => (
  <div className="ItemList">
    {items.map(item => (
      <InlineEvent
        key={item._id}
        name={item.name}
        date={item.date}
        location={item.location}
        description={item.description}
        id={item._id}
        updateCurrentEvent={updateCurrentEvent}
      />
    ))}
  </div>
);

EventList.propTypes = {
  items: PropTypes.array,
  updateCurrentEvent: PropTypes.func
};

export default EventList;
