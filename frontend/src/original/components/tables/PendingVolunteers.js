import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

const columns = [
  {
    id: 'full_name', // Required because our accessor is not a string
    Header: 'Full Name',
    accessor: d => `${d.bio.first_name}  ${d.bio.last_name}` // Custom value accessors!
  },
  {
    id: 'age',
    Header: 'Age',
    accessor: d => {
      const currentYear = new Date().getYear();
      const userYear = new Date(d.bio.date_of_birth).getYear();
      return currentYear - userYear;
    },
    maxWidth: 50
  },
  {
    id: 'criminal_history', // Required because our accessor is not a string
    Header: 'Criminal History',
    accessor: d => {
      const { felony, sexual_violent, drugs, driving } = d.criminal;
      if (felony || sexual_violent || drugs || driving) {
        return 'Yes';
      }
      return 'None';
    },
    maxWidth: 140,
    minWidth: 100
  },
  {
    id: 'referral',
    Header: 'Referral',
    accessor: d => {
      let referral = '';
      if (d.referral.friend) referral += 'Friend ';
      if (d.referral.newsletter) referral += 'Newsletter ';
      if (d.referral.event) referral += 'Event ';
      if (d.referral.volunteer_match) referral += 'Volunteer Match ';
      if (d.referral.internet) referral += 'Internet ';
      if (d.referral.social_media) referral += 'Social Media ';
      return referral;
    },
    maxWidth: 100
  },
  {
    Header: 'Email',
    accessor: 'bio.email'
  },
  {
    Header: 'Phone Number',
    accessor: 'bio.phone_number',
    maxWidth: 175
  }
];

function showPagination(size) {
  return size > 5;
}
const PendingVolunteers = props => (
  <div>
    <ReactTable
      data={props.data}
      filterable
      columns={columns}
      defaultPageSize={5}
      showPageSizeOptions={false}
      showPagination={showPagination(props.data.length)}
      className="-striped -highlight"
      getTdProps={(state, rowInfo, column, instance) => {
        return {
          onClick: e => props.updateVolunteer(rowInfo.original._id)
        };
      }}
    />
  </div>
);

PendingVolunteers.propTypes = {
  data: PropTypes.array
};

export default PendingVolunteers;
