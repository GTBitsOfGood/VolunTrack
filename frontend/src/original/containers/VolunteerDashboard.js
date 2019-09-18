// NPM Packages
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Row, Panel } from 'react-bootstrap';
// import { SocialIcons } from 'react-social-icons';

// Local Imports
import '../assets/stylesheets/ItemDisplay.css';
import * as eventActions from '../actions/events.js';
import UpcomingEvents from '../components/tables/UpcomingEvents';
import EventsRegistered from '../components/tables/EventsRegistered';

class VolunteersDashboard extends React.Component {
  componentWillMount() {
    console.log(this.props.match);
    if (this.props.match !== undefined) {
      this.props.loadAllEvents(this.props.match.params.id);
    } else if (this.props.match === undefined) {
      this.props.loadAllEvents(null);
    }
  }

  findEvent() {
    this.eventsArr = this.props.all;
    return this.eventsArr.find(val => val._id === this.props.current_event._id);
  }

  render() {
    return (
      <div>
        <Row style={{ marginBottom: '0px' }}>
          <Col
            md={8}
            smOffset={1}
            lgOffset={2}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              paddingTop: '10px',
              paddingBottom: '20px',
              paddingLeft: '20px',
              paddingRight: '20px'
            }}
          >
            <Panel header={<h3>Welcome</h3>} bsStyle="info">
              <p>
                Welcome to our volunteer portal. The place for volunteers whose application has been
                filled out and approved! Thank you in advance for your time and energy dedicated to
                help us achieve our mission of empowering children through the use of art! Check out
                our social media presence to see some really cool pictures and experiences :)
              </p>
              {/*<SocialIcons
                            urls={["https://twitter.com/drawchange",
                                "https://www.facebook.com/drawchange",
                                "http://www.flickr.com/photos/drawchange",
                                "http://youtube.com/drawchange",
                                "https://www.linkedin.com/company/drawchange",
                                "https://www.tumblr.com/tagged/drawchange",
                                "http://instagram.com/drawchange",
                                "https://www.pinterest.com/drawchange/",
                                "https://plus.google.com/102192290642344173249"]} /> */}
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col
            md={7}
            mdOffset={1}
            style={{ backgroundColor: 'rgba(255, 255, 255, 1)', paddingTop: '10px' }}
            smOffset={1}
            lgOffset={2}
            lg={4}
            sm={5}
          >
            <Panel header={<h3>Documents</h3>} bsStyle="info">
              <h4>Volunteer Manual</h4>
              <p>
                Please click{' '}
                <a
                  target="_blank"
                  href="http://drawchange.org/wp-content/uploads/2015/03/VolunteerHandbook-EmotionalStress.pdf"
                >
                  {' '}
                  here{' '}
                </a>{' '}
                for our manual so you know what to expect and what to do if a situation arises on
                your volunteer shift.
              </p>
              <ol>
                <li>
                  We are there for the children. Please minimize chatter between volunteers and make
                  this hour all about the children.
                </li>
                <li>Be their friend but always remember you are their superior.</li>
                <li>
                  Use the language we expect them to use: please and thank you for everything.
                </li>
              </ol>
              <h4>Child Protection Policy</h4>
              <p>
                In the interest of child protection and abuse prevention, drawchange™ has adopted
                the attached policy concerning interactions with children minors, under the
                supervision and direction of drawchange™ staff and volunteers. It is important that
                staff and volunteers understand the Purpose of this document and implement the
                Prevention Guidelines and Response Procedures of this policy. Click{' '}
                <a
                  target="_blank"
                  href="http://drawchange.org/wp-content/uploads/2017/07/childprotectionpolicy.pdf"
                >
                  {' '}
                  here{' '}
                </a>
                to view and download our child protection clause.{' '}
              </p>
            </Panel>

            {/*<Panel header={<h3>My Events</h3>} bsStyle="info">
            <MyEvents data={this.props.all} updateEvent={this.props.updateCurrentEvent}/>
            </Panel>*/}
          </Col>
          <Col
            sm={5}
            lg={4}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              paddingTop: '10px',
              paddingBottom: '243px'
            }}
          >
            {/*<Panel header={<h3>Event Details</h3>} bsStyle="info">

                 {this.props.current_event && this.props.}
              {this.props.current_event && <VolunteersEventDetails user = {this.props.userId} event=
                {this.props.current_event} signUp={this.props.onSignUp} unregister=
                {this.props.unSignUp} allVolunteers={this.findEvent()}/>}
              {!this.props.current_event && <h2>Click an Event to view details</h2>}
            </Panel>*/}

            {/* <Panel header={<h3>Donate</h3>} bsStyle="info">

              <DonateButton />
            </Panel> */}
            <Panel header={<h3>Registered Events</h3>} bsStyle="info">
              <EventsRegistered
                id={this.props.userId}
                data={this.props.all}
                updateEvent={this.props.updateCurrentEvent}
              />
            </Panel>
            <Panel header={<h3>Quick Links</h3>} bsStyle="info">
              <div>
                <ul>
                  <li>
                    <a href="mailto:karachtani@gmail.com"> Contact Us!</a>{' '}
                  </li>
                  <li>
                    <a target="_blank" href="https://secure.donationpay.org/drawchange/">
                      {' '}
                      Donate
                    </a>{' '}
                  </li>
                  <li>
                    <a target="_blank" href="http://signup.com/go/A8nqmi">
                      {' '}
                      Atlanta Homeless Shelter and special event opportunities
                    </a>{' '}
                  </li>
                  <li>
                    <a target="_blank" href="http://signup.com/go/OHsNfaH">
                      {' '}
                      Orlando Homeless Shelter opportunities
                    </a>{' '}
                  </li>
                  <li>
                    <a target="_blank" href="https://www.volunteermatch.org/search/org260116.jsp">
                      {' '}
                      Miscellaneous opportunities
                    </a>{' '}
                  </li>
                </ul>
              </div>
            </Panel>
            <Panel header={<h3>All Events</h3>} bsStyle="info">
              <UpcomingEvents data={this.props.all} updateEvent={this.props.updateCurrentEvent} />
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

VolunteersDashboard.propTypes = {
  onLoadVolunteers: PropTypes.func,
  currentVolunteer: PropTypes.string,
  volunteersList: PropTypes.array,
  updateCurrentVolunteer: PropTypes.func,
  updateCurrentEvent: PropTypes.func,
  current_event: PropTypes.object,
  onSignUp: PropTypes.func,
  unSignUp: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  return {
    pending: state.volunteers.pending,
    all: state.events.all,
    current_event: state.events.current_event,
    userId: state.auth.user._id
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(eventActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VolunteersDashboard);
