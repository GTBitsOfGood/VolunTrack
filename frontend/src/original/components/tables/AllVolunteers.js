import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as volunteerActions from '../../actions/volunteers.js';

import 'react-table/react-table.css';

class AllVolunteers extends React.Component {
  constructor(props) {
    super(props);
    this.showPagination = this.showPagination.bind(this);
    this.updateSelectedVolunteers = this.updateSelectedVolunteers.bind(this);
  }

  showPagination(size) {
    // return false;
    return size > 8;
  }

  updateSelectedVolunteers(event, volunteerId) {
    if (event.target.checked) {
      this.props.addSelectedVolunteer(volunteerId);
    } else {
      this.props.removeSelectedVolunteer(volunteerId);
    }
  }

  render() {
    const columns = [
      {
        id: 'checkbox',
        accessor: 'checkbox',
        Cell: ({ original }) => {
          return (
            <input
              type="checkbox"
              name="checkbox"
              onChange={event => this.updateSelectedVolunteers(event, original._id)}
            />
          );
        },
        minWidth: 25,
        filterable: false
      },
      {
        id: 'full_name', // Required because our accessor is not a string
        Header: 'Full Name',
        accessor: d => `${d.bio.first_name}  ${d.bio.last_name}`, // Custom value accessors!
        filterMethod: (filter, row) =>
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
      },
      {
        Header: 'Email',
        accessor: 'bio.email',
        minWidth: 150
      },
      {
        Header: 'Phone Number',
        accessor: 'bio.phone_number',
        maxWidth: 150,
        filterable: false
      }
    ];

    return (
      <div>
        <ReactTable
          data={this.props.data}
          filterable
          columns={columns}
          defaultPageSize={8}
          minRows={0}
          showPageSizeOptions={true}
          showPagination={this.showPagination(this.props.data.length)}
          className="-striped -highlight"
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: e => this.props.updateVolunteer(rowInfo.original._id)
            };
          }}
        />
      </div>
    );
  }
}

AllVolunteers.propTypes = {
  data: PropTypes.array,
  updateVolunteer: PropTypes.func,
  addSelectedVolunteer: PropTypes.func,
  removeSelectedVolunteer: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    selected_volunteers: state.volunteers.selected_volunteers
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(volunteerActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllVolunteers);
