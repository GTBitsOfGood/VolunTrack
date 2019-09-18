import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateVolunteerFilter } from '../actions/volunteers.js';

class VolunteersFilter extends React.Component {
  constructor(props) {
    super(props);
    this.updateTextFields = this.updateTextFields.bind(this);
    this.updateAvailabilityFilter = this.updateAvailabilityFilter.bind(this);
    this.noFunction = this.noFunction.bind(this);
    this.updateCriminalHistoryFilter = this.updateCriminalHistoryFilter.bind(this);
    this.updateBirthdayFilter = this.updateBirthdayFilter.bind(this);
  }

  updateTextFields() {
    this.props.updateVolunteerFilter(
      Object.assign({}, this.props.filter, {
        language: this.languageFilter.value.toLowerCase(),
        skills: this.skillsFilter.options[this.skillsFilter.selectedIndex].value
      })
    );
  }

  updateAvailabilityFilter() {
    let availabilityObj = {
      weekday_mornings: this.weekday_mornings_chk.checked == false ? false : true,
      weekday_afternoons: this.weekday_afternoons_chk.checked == false ? false : true,
      weekday_evenings: this.weekday_evenings_chk.checked == false ? false : true,
      weekend_mornings: this.weekend_mornings_chk.checked == false ? false : true,
      weekend_afternoons: this.weekend_afternoons_chk.checked == false ? false : true,
      weekend_evenings: this.weekend_evenings_chk.checked == false ? false : true
    };
    let filterSet = {
      set:
        availabilityObj.weekday_mornings ||
        availabilityObj.weekday_afternoons ||
        availabilityObj.weekday_evenings ||
        availabilityObj.weekend_mornings ||
        availabilityObj.weekend_afternoons ||
        availabilityObj.weekend_evenings
    };
    Object.assign(availabilityObj, filterSet);

    this.props.updateVolunteerFilter(
      Object.assign({}, this.props.filter, { availability: availabilityObj })
    );
  }

  updateCriminalHistoryFilter() {
    // this.props.updateVolunteerFilter(Object.assign(
    //   {},
    //   this.props.filter,
    //   {criminal_history: this.props.criminalHistoryFilter.options[this.criminalHistoryFilter.selectedIndex].value}))

    const criminalObj = {
      no_felony: this.felony_chk.checked,
      no_sexual_violent: this.sexual_violent_chk.checked,
      no_drugs: this.drugs_chk.checked,
      no_driving: this.driving_chk.checked
    };

    this.props.updateVolunteerFilter(
      Object.assign({}, this.props.filter, { criminal_history: criminalObj })
    );
  }

  updateBirthdayFilter() {
    const bdayObj = {
      month: this.birthdayMonthFilter.value,
      day: this.birthdayDayFilter.value
    };

    this.props.updateVolunteerFilter(Object.assign({}, this.props.filter, { birthday: bdayObj }));
  }

  noFunction() {
    return false;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.noFunction}>
          <b>Language:</b>{' '}
          <input
            type="text"
            label="Language"
            onChange={this.updateTextFields}
            ref={input => {
              this.languageFilter = input;
            }}
            placeholder="Language"
          />
          <br />
          <b>Birthday:</b>
          <input
            type="number"
            placeholder="MM"
            onChange={this.updateBirthdayFilter}
            ref={input => {
              this.birthdayMonthFilter = input;
            }}
            min="1"
            max="12"
            step="1"
          />
          <input
            type="number"
            placeholder="DD"
            onChange={this.updateBirthdayFilter}
            ref={input => {
              this.birthdayDayFilter = input;
            }}
            min="1"
            max="31"
            step="1"
          />
          <br />
          <b>Skills/Interests:</b>{' '}
          <select
            name="Skills"
            onChange={this.updateTextFields}
            ref={select => {
              this.skillsFilter = select;
            }}
            defaultValue="no_filter"
          >
            <option value="no_filter">No filter</option>
            <option value="admin_in_office">Admin (In Office)</option>
            <option value="admin_virtual">Admin (Virtual)</option>
            <option value="atlanta_shelter">Atlanta Shelter</option>
            <option value="orlando_shelter">Orlando Shelter</option>
            <option value="graphic_web_design">Graphic Web Design</option>
            <option value="special_events">Special Events</option>
            <option value="grant_writing">Grant Writing</option>
            <option value="writing_editing">Writing Editing</option>
            <option value="social_media">Social Media</option>
            <option value="fundraising">Fundraising</option>
            <option value="finance">Finance</option>
            <option value="office_maintenance_housekeeping">Office Maintenance Housekeeping</option>
            <option value="international_projects">International Projects</option>
            <option value="volunteer_coordination">Volunteer Coordination</option>
            <option value="outreach">Outreach</option>
          </select>
          <br />
          <b>Criminal History:</b> <br />
          <input
            type="checkbox"
            name="felony"
            value="felony"
            onChange={this.updateCriminalHistoryFilter}
            ref={checkbox => {
              this.felony_chk = checkbox;
            }}
          />{' '}
          No Felonies
          <br />
          <input
            type="checkbox"
            name="sexual_violent"
            value="sexual_violent"
            onChange={this.updateCriminalHistoryFilter}
            ref={checkbox => {
              this.sexual_violent_chk = checkbox;
            }}
          />{' '}
          No Sexual Violence Incidents
          <br />
          <input
            type="checkbox"
            name="drugs"
            value="drugs"
            onChange={this.updateCriminalHistoryFilter}
            ref={checkbox => {
              this.drugs_chk = checkbox;
            }}
          />{' '}
          No Drug Offences
          <br />
          <input
            type="checkbox"
            name="driving"
            value="driving"
            onChange={this.updateCriminalHistoryFilter}
            ref={checkbox => {
              this.driving_chk = checkbox;
            }}
          />{' '}
          No Driving Offences
          <br />
          <b>Availability:</b> <br />
          <input
            type="checkbox"
            name="weekday_mornings"
            value="weekday_mornings"
            onChange={this.updateAvailabilityFilter}
            ref={checkbox => {
              this.weekday_mornings_chk = checkbox;
            }}
          />{' '}
          Weekday Mornings
          <br />
          <input
            type="checkbox"
            name="weekday_afternoons"
            value="weekday_afternoons"
            onChange={this.updateAvailabilityFilter}
            ref={checkbox => {
              this.weekday_afternoons_chk = checkbox;
            }}
          />{' '}
          Weekday Afternoons
          <br />
          <input
            type="checkbox"
            name="weekday_evenings"
            value="weekday_evenings"
            onChange={this.updateAvailabilityFilter}
            ref={checkbox => {
              this.weekday_evenings_chk = checkbox;
            }}
          />{' '}
          Weekday Evenings
          <br />
          <input
            type="checkbox"
            name="weekend_mornings"
            value="weekend_mornings"
            onChange={this.updateAvailabilityFilter}
            ref={checkbox => {
              this.weekend_mornings_chk = checkbox;
            }}
          />{' '}
          Weekend Mornings
          <br />
          <input
            type="checkbox"
            name="weekend_afternoons"
            value="weekend_afternoons"
            onChange={this.updateAvailabilityFilter}
            ref={checkbox => {
              this.weekend_afternoons_chk = checkbox;
            }}
          />{' '}
          Weekend Afternoons
          <br />
          <input
            type="checkbox"
            name="weekend_evenings"
            value="weekend_evenings"
            onChange={this.updateAvailabilityFilter}
            ref={checkbox => {
              this.weekend_evenings_chk = checkbox;
            }}
          />{' '}
          Weekend Evenings
          <br />
        </form>
      </div>
    );
  }
}

VolunteersFilter.propTypes = {
  updateVolunteerFilter: PropTypes.func,
  filter: PropTypes.object
};

const mapStateToProps = state => {
  return {
    filter: state.volunteers.filter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateVolunteerFilter: filter => {
      dispatch(updateVolunteerFilter(filter));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VolunteersFilter);
