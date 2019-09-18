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
    Header: 'Email',
    accessor: 'bio.email',
    minWidth: 150
  },
  {
    Header: 'Phone Number',
    accessor: 'bio.phone_number',
    maxWidth: 150
  }
];

function showPagination(size) {
  // return false;
  return size > 5;
}
const NewVolunteers = props => (
  <div>
    <ReactTable
      data={props.data}
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

NewVolunteers.propTypes = {};

export default NewVolunteers;
