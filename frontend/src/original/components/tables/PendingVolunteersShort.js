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
const PendingVolunteersShort = props => {
  console.log(props);
  return (
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
            onClick: e => (rowInfo ? props.updateVolunteer(rowInfo.original._id) : null)
          };
        }}
      />
    </div>
  );
};
PendingVolunteersShort.propTypes = {
  data: PropTypes.array
};

export default PendingVolunteersShort;
