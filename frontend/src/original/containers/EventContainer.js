// NPM Packages
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Row, Panel, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// Local Imports
import '../assets/stylesheets/ItemDisplay.css';
import * as eventActions from '../actions/events.js';
import UpcomingEvents from '../components/tables/UpcomingEvents';
import EventsRegistered from '../components/tables/EventsRegistered';
import EventDetails from '../components/EventDetails';

class EventContainer extends React.Component {
  componentWillMount() {
    this.props.loadAllEvents(this.props.match.params.id);
  }

  // onCreateEvent() {
  //   console.log("clicked");
  //   return (
  //       <Route exact path={'/createEvent'} component={EventForm} />
  //   );
  // }

  render() {
    return (
      <div>
        <Row>
          <Col
            smOffset={1}
            lgOffset={2}
            lg={4}
            sm={5}
            style={{ backgroundColor: 'rgba(255, 255, 255, 1)', paddingBottom: '3px' }}
          >
            <h1>Volunteer Events</h1>
          </Col>
          {this.props.role === 'admin' && (
            <Col sm={5} lg={4} style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
              <Nav
                pullRight
                style={{ marginTop: '20px', marginBottom: '10px', fontSize: 'initial' }}
                bsStyle="pills"
              >
                <LinkContainer exact to="/events/new">
                  <NavItem>+ New Event</NavItem>
                </LinkContainer>
              </Nav>
            </Col>
          )}
        </Row>
        <Row>
          <Col
            smOffset={1}
            lgOffset={2}
            lg={4}
            sm={5}
            style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
          >
            <Panel header={<h3>Registered Events</h3>} bsStyle="info">
              <EventsRegistered
                id={this.props.user['_id']}
                data={this.props.all}
                updateEvent={this.props.updateCurrentEvent}
              />
            </Panel>
            <Panel header={<h3>All Event</h3>} bsStyle="info">
              {/* <input type={text}> */}
              <UpcomingEvents data={this.props.all} updateEvent={this.props.updateCurrentEvent} />
            </Panel>
            <Panel header={<h3>Upcoming Events</h3>} bsStyle="info">
              {/* <input type={text}> */}
              <UpcomingEvents data={this.props.all} updateEvent={this.props.updateCurrentEvent} />
            </Panel>
          </Col>
          <Col
            sm={5}
            lg={4}
            style={{ backgroundColor: 'rgba(255, 255, 255, 1)', paddingBottom: '344px' }}
          >
            <Panel header={<h3>Event Detail</h3>} bsStyle="info">
              {this.props.current_event && (
                <EventDetails
                  event={this.props.current_event}
                  user={this.props.user}
                  onSignUp={this.props.onSignUp}
                  unSignUp={this.props.unSignUp}
                />
              )}
              {!this.props.current_event && <h3> Click an Event to view details </h3>}
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

EventContainer.propTypes = {
  onLoadVolunteers: PropTypes.func,
  currentVolunteer: PropTypes.string,
  volunteersList: PropTypes.array,
  updateCurrentVolunteer: PropTypes.func,
  role: PropTypes.string,
  onSignUp: PropTypes.func,
  unSignUp: PropTypes.func
};

const mapStateToProps = state => {
  return {
    pending: state.volunteers.pending,
    all: state.events.all,
    current_event: state.events.current_event,
    role: state.auth.user.bio.role,
    user: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(eventActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventContainer);
