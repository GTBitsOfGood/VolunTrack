import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const VolunteerProfile = ({ user, onClickApprove, onClickDeny, onClickDelete }) => (
  <div style={{ height: '500px', overflow: 'scroll' }}>
    <h3> Personal Information </h3>
    <p> Current Status: {user.bio.role} </p>
    <p> Name: {`${user.bio.first_name} ${user.bio.last_name}`} </p>
    <p>
      {' '}
      Email: <a href={'mailto:' + user.bio.email}>{user.bio.email}</a>{' '}
    </p>
    <p>
      {' '}
      Phone Number: <a href={'tel:' + user.bio.phone_number}> {user.bio.phone_number}</a>{' '}
    </p>
    <p>
      {' '}
      Date of Birth: <Moment format="MM/DD/YYYY">{user.bio.date_of_birth.split('T')[0]}</Moment>
    </p>
    <p> Street Address: {user.bio.street_address} </p>
    <p> City: {user.bio.city} </p>
    <p> State: {user.bio.state} </p>
    <p> Zip Code: {user.bio.zip_code} </p>
    <p> Languages: {user.bio.languages} </p>

    <h3> Availability </h3>
    <ul>
      {user.availability.weekday_mornings && <li> Weekday Mornings </li>}
      {user.availability.weekday_afternoons && <li> Weekday Afternoons </li>}
      {user.availability.weekday_evenings && <li> Weekday Evenings </li>}
      {user.availability.weekend_mornings && <li> Weekend Mornings </li>}
      {user.availability.weekend_afternoons && <li> Weekend Afternoons </li>}
      {user.availability.weekend_evenings && <li> Weekend Evenings </li>}
    </ul>

    <h3> Skills and Interests </h3>
    <ul>
      {Object.keys(user.skills_interests)
        .filter(key => user.skills_interests[key])
        .map(skill => (
          <li key={skill}>{skill}</li>
        ))}
    </ul>

    <h3> About Volunteer </h3>
    {/*<p> Availability: {user.availability} </p>
    <p> Skills: {user.skills_interests} </p>*/}
    <p> Why are you interested in volunteering: {user.history.volunteer_interest_cause} </p>
    {/* <p> How did you hear about drawchange: {user.referral} </p> */}
    <p> What would you need from us: {user.history.volunteer_support} </p>
    <p>
      {' '}
      What do you do when you realize you cannot keep a commitment:{' '}
      {user.history.volunteer_commitment}{' '}
    </p>
    <p>
      {' '}
      Summarize skills and qualifications you have obtained from previous work:{' '}
      {user.history.skills_qualifications}{' '}
    </p>
    <p> Previous Volunteer Experience: {user.history.previous_volunteer_experience} </p>

    <h3> Employment History </h3>
    <p> Current Employer: {user.employment.name} </p>
    <ul>
      <li> Position: {user.employment.position} </li>
      <li> Duration: {user.employment.duration} </li>
      <li> Location: {user.employment.location} </li>
    </ul>
    <p> Previous Employer: {user.employment.previous_name} </p>
    <ul>
      <li> Location: {user.employment.previous_location} </li>
      <li> Reason for Leaving: {user.employment.previous_reason_for_leaving} </li>
    </ul>

    <h3> Reference </h3>
    <p> Name: {user.reference.name} </p>
    <p>
      {' '}
      Email: <a href={'mailto:' + user.reference.email}>{user.reference.email}</a>{' '}
    </p>
    <p>
      {' '}
      Phone Number:{' '}
      <a href={'tel:' + user.reference.phone_number}> {user.reference.phone_number}</a>{' '}
    </p>
    <p> Relationship: {user.reference.relationship} </p>
    <p> How long have you known reference: {user.reference.duration} </p>

    <h3> Criminal History </h3>
    {user.criminal.felony && <p> Felony: Yes</p>}
    {user.criminal.sexual_violent && <p> Sexual Violence: Yes</p>}
    {user.criminal.drugs && <p> Drugs: Yes</p>}
    {user.criminal.driving && <p> Driving: Yes</p>}
    {user.criminal.felony ||
    user.criminal.drugs ||
    user.criminal.sexual_violent ||
    user.criminal.driving ? (
      <p> Explanation: {user.criminal.explanation} </p>
    ) : (
      <p> No criminal history. </p>
    )}

    <h3> Emergency Contact </h3>
    <p> Relationship: {user.ice.relationship} </p>
    <p> Name: {user.ice.name} </p>
    <p>
      {' '}
      Email: <a href={'mailto:' + user.ice.email}>{user.ice.email}</a>{' '}
    </p>
    <p>
      {' '}
      Phone Number: <a href={'tel:' + user.ice.phone_number}> {user.ice.phone_number}</a>{' '}
    </p>
    <p> Address: {user.ice.address} </p>

    <h3> Additional Comments </h3>
    <p>{user.permissions.comments ? user.permissions.comments : 'None'} </p>

    <h3> Permissions </h3>
    <p> Verify Reference: {user.permissions.reference ? 'Granted' : 'Denied'} </p>
    <p> Use personal image: {user.permissions.personal_image ? 'Granted' : 'Denied'} </p>
    <p> Add to Mailing List: {user.permissions.email_list ? 'Granted' : 'Denied'} </p>
    <p> Signature: {user.permissions.signature} </p>

    {user.bio.role === 'pending' && (
      <button type="button" onClick={() => onClickApprove()}>
        {' '}
        Approve{' '}
      </button>
    )}
    {user.bio.role === 'pending' && (
      <button type="button" onClick={() => onClickDeny()}>
        {' '}
        Deny{' '}
      </button>
    )}
    {user.bio.role === 'volunteer' && (
      <button type="button" onClick={() => onClickDeny()}>
        {' '}
        Deny{' '}
      </button>
    )}
    {user.bio.role === 'denied' && (
      <button type="button" onClick={() => onClickApprove()}>
        {' '}
        Approve{' '}
      </button>
    )}
    <button
      type="button"
      onClick={() => {
        confirm('Are you sure you want to delete this volunteer?') ? onClickDelete() : null;
      }}
    >
      {' '}
      DELETE{' '}
    </button>
  </div>
);

VolunteerProfile.propTypes = {
  user: PropTypes.object,
  onClickApprove: PropTypes.func,
  onClickDeny: PropTypes.func,
  onClickDelete: PropTypes.func
};

export default VolunteerProfile;
