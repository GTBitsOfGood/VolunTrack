// NPM Packages
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Row, Panel, ButtonGroup, Button } from 'react-bootstrap';

// Local Imports
import '../assets/stylesheets/ItemDisplay.css';
import * as volunteerActions from '../actions/volunteers.js';
import VolunteerProfile from '../components/VolunteerProfile';
import VolunteersFilter from '../components/VolunteersFilter';
import AllVolunteers from '../components/tables/AllVolunteers';

class VolunteersContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.loadAllVolunteers(this.props.match.params.id);
    this.props.loadPendingVolunteers();
    this.props.loadDeniedVolunteers();
  }

  // eventually we should move this logic to redux...
  //   renderItem() {
  //     if (this.props.currentVolunteer !== null) {
  //       return this.props.volunteersList.find((item) => item._id === this.props.currentVolunteer);
  //     }
  //     return null;
  //   }

  passesFilter(user) {
    let filter = this.props.filter;

    /** LANGUAGES FILTER **/
    if (!user.bio.languages.toLowerCase().includes(filter.language)) {
      return false;
    }

    /** SKILLS FILTER **/
    if (filter.skills && filter.skills !== 'no_filter') {
      if (user.skills_interests[filter.skills] !== true) {
        return false;
      }
    }

    /** CRIMINAL HISTORY FILTER **/
    if (user.criminal.felony && filter.criminal_history.no_felony) return false;
    if (user.criminal.sexual_violent && filter.criminal_history.no_sexual_violent) return false;
    if (user.criminal.drugs && filter.criminal_history.no_drugs) return false;
    if (user.criminal.driving && filter.criminal_history.no_driving) return false;

    /** BIRTHDAY FILTER **/
    let userBday = user.bio.date_of_birth.split('T')[0].split('-');
    userBday = { month: parseInt(userBday[1]), day: parseInt(userBday[2]) };
    if (filter.birthday.month) {
      if (filter.birthday.month != userBday.month) return false;
    }
    if (filter.birthday.day) {
      if (filter.birthday.day != userBday.day) return false;
    }

    /** AVAILABILITY FILTER **/
    if (filter.availability.set) {
      if (!user.availability.weekday_mornings && filter.availability.weekday_mornings) return false;
      if (!user.availability.weekday_afternoons && filter.availability.weekday_afternoons)
        return false;
      if (!user.availability.weekday_evenings && filter.availability.weekday_evenings) return false;
      if (!user.availability.weekend_mornings && filter.availability.weekend_mornings) return false;
      if (!user.availability.weekend_afternoons && filter.availability.weekend_afternoons)
        return false;
      if (!user.availability.weekend_evenings && filter.availability.weekend_evenings) return false;
    }

    /** PASSES ALL FILTERS **/
    return true;
  }

  render() {
    return (
      <div>
        <Row>
          <Col
            smOffset={1}
            lgOffset={2}
            lg={8}
            sm={7}
            md={8}
            style={{ backgroundColor: 'rgba(255, 255, 255, 1)', paddingBottom: '3px' }}
          >
            <h1>Manage Volunteers</h1>
          </Col>
        </Row>
        <Row>
          <Col
            smOffset={1}
            lgOffset={2}
            lg={4}
            sm={5}
            style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
          >
            <Panel header={<h3>Filter</h3>} bsStyle="info">
              {/* <input type={text}> */}
              <VolunteersFilter />
            </Panel>
            <Panel header={<h3>Actions</h3>} bsStyle="info">
              {this.props.selected_volunteers.length > 0 && (
                <ButtonGroup>
                  {/*Email action*/}
                  <Button>
                    <a
                      href={
                        'mailto:?bcc=' +
                        this.props.selected_volunteers.map(volunteer => volunteer.email).join(',')
                      }
                    >
                      {' '}
                      Email
                    </a>
                  </Button>
                </ButtonGroup>
              )}
            </Panel>

            <Panel header={<h3>All Volunteers</h3>} bsStyle="info">
              {/* <input type={text}> */}
              <AllVolunteers
                data={this.props.all.filter(user => this.passesFilter(user))}
                updateVolunteer={this.props.updateCurrentVolunteer}
              />
            </Panel>
            <Panel header={<h3>Pending Volunteers</h3>} bsStyle="info">
              <AllVolunteers
                data={this.props.pending.filter(user => this.passesFilter(user))}
                updateVolunteer={this.props.updateCurrentVolunteer}
              />
            </Panel>
            <Panel header={<h3>Denied Volunteers</h3>} bsStyle="info">
              <AllVolunteers
                data={this.props.denied.filter(user => this.passesFilter(user))}
                updateVolunteer={this.props.updateCurrentVolunteer}
              />
            </Panel>
          </Col>
          <Col
            sm={5}
            lg={4}
            style={{ backgroundColor: 'rgba(255, 255, 255, 1)', paddingBottom: '1098px' }}
          >
            <Panel header={<h3>Volunteer Details</h3>} bsStyle="info">
              {this.props.current_volunteer && (
                <VolunteerProfile
                  user={this.props.current_volunteer}
                  onClickApprove={() => {
                    this.props.approvePendingVolunteer(this.props.current_volunteer._id);
                    location.reload(true);
                  }}
                  onClickDeny={() => {
                    this.props.denyPendingVolunteer(this.props.current_volunteer._id);
                    location.reload(true);
                  }}
                  onClickDelete={() => {
                    this.props.deleteVolunteer(this.props.current_volunteer._id);
                    location.reload(true);
                  }}
                />
              )}

              {!this.props.current_volunteer && <h3>Click on a Volunteer to view details</h3>}
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

VolunteersContainer.propTypes = {
  onLoadVolunteers: PropTypes.func,
  current_volunteer: PropTypes.object,
  volunteersList: PropTypes.array,
  updateCurrentVolunteer: PropTypes.func,
  approvePendingVolunteer: PropTypes.func,
  denyPendingVolunteer: PropTypes.func,
  loadAllVolunteers: PropTypes.func,
  deleteVolunteer: PropTypes.func,
  filter: PropTypes.object,
  denied: PropTypes.array,
  all: PropTypes.array,
  pending: PropTypes.array,
  selected_volunteers: PropTypes.array
};

const mapStateToProps = state => {
  return {
    pending: state.volunteers.pending,
    denied: state.volunteers.denied,
    deleted: state.volunteers.deleted, //delete when done.
    all: state.volunteers.all,
    current_volunteer: state.volunteers.current_volunteer,
    filter: state.volunteers.filter,
    selected_volunteers: state.volunteers.selected_volunteers
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(volunteerActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VolunteersContainer);
