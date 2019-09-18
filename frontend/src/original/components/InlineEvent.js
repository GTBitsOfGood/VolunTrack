import React from 'react';
import PropTypes from 'prop-types';

import '../assets/stylesheets/ItemDisplay.css';

const InlineEvent = ({ id, name, date, location, description, updateCurrentEvent }) => (
  <div className="singleItem" onClick={() => updateCurrentEvent(id)}>
    <div className="itemName">{name}</div>
    <div className="itemDate">{date}</div>
    <div className="itemLocation">{location}</div>
    <div className="itemDescription">{description}</div>
  </div>
);

InlineEvent.propTypes = {
  name: PropTypes.string,
  date: PropTypes.string,
  location: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string,
  updateCurrentEvent: PropTypes.func
};

export default InlineEvent;

// class InlineEvent extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return(
//             <div className="singleItem" onClick= {()=>this.props.updateCurrentEvent(this.props.id)}>

//                 <div className="itemName">
//                     {this.props.name}
//                 </div>
//                 <div className="itemDate">
//                     {this.props.date}
//                 </div>
//                 <div className="itemLocation">
//                     {this.props.location}
//                 </div>
//                 <div className="itemDescription" >
//                     {this.props.description}
//                 </div>
//             </div>
//     );
//   }

// }

// export default InlineEvent;
