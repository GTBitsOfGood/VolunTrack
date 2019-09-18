import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

const data = [
  {
    name: 'Event 1',
    date: new Date(),
    volunteers: ['1', '2']
  },
  {
    name: 'Event 2',
    date: new Date(),
    volunteers: ['1', '2', '3']
  },
  {
    name: 'Event 3',
    date: new Date(),
    volunteers: ['1', '2']
  },
  {
    name: 'Event 4',
    date: new Date(),
    volunteers: []
  },
  {
    name: 'Event 5',
    date: new Date(),
    volunteers: ['1']
  },
  {
    name: 'Event 6',
    date: new Date(),
    volunteers: []
  }
];

const columns = [
  {
    Header: 'Event Name',
    accessor: 'name' // String-based value accessors!
  },
  {
    Header: 'Event Date',
    id: 'event_date',
    accessor: d => new Date(d.date).toDateString() // String-based value accessors!
  }
];

function showPagination(size) {
  return false;
  // return size > 5;
}
const MyEvents = props => (
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
          onClick: e => {
            props.updateEvent(rowInfo.original._id);
            console.log(rowInfo.original);
          }
        };
      }}
    />
  </div>
);

MyEvents.propTypes = {};

export default MyEvents;
