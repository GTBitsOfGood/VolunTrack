import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Control, Form, Fieldset, Errors } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import validator from 'validator';
var isPhoneNumber = require('is-phone-number');
var isValidZip = require('is-valid-zip');
var isValidDate = require('is-valid-date');
var Tabs = require('react-simpletabs');

// Local Components
import { updateProfile } from '../../actions/auth';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import Text from '../../components/inputs/Text';
import TextArea from '../../components/inputs/Textarea';
import Checkbox from '../../components/inputs/Checkbox';
import '../../assets/stylesheets/ItemDisplay.css';
import '../../assets/stylesheets/react-simpletabs.css';
class EditProfileForm extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.props.swal({
        title: 'Registration Failed!',
        type: 'error',
        confirmButtonText: 'Ok'
      });
    } else if (nextProps.success) {
      this.props.swal({
        title: 'Registration Success!',
        text: 'Now Please Login',
        type: 'success',
        confirmButtonText: 'Ok'
      });
    }
  }

  render() {
    return (
      <div>
        <Col
          md={6}
          mdOffset={3}
          style={{ backgroundColor: 'rgba(255, 255, 255, 1)', paddingTop: '30px' }}
        >
          <Form model="forms.user" onSubmit={v => console.log(v)}>
            <Tabs>
              <Tabs.Panel title="Personal Information">
                <h2>Personal Information</h2>

                <Fieldset model=".bio">
                  <div>
                    <Control
                      required
                      component={Text}
                      model=".first_name"
                      label="First Name"
                      defaultValue={String(this.props.user.bio.first_name)}
                      type="text"
                      errors={{
                        isRequired: val => !val
                      }}
                    />

                    <Errors
                      className="errors"
                      model=".first_name"
                      show="focus"
                      messages={{
                        isRequired: 'Please enter a first name'
                      }}
                    />
                  </div>
                  <Control
                    required
                    component={Text}
                    model=".last_name"
                    label="Last Name"
                    defaultValue={String(this.props.user.bio.last_name)}
                    type="text"
                    errors={{ isRequired: val => !val }}
                  />
                  <Errors
                    className="errors"
                    model=".last_name"
                    show="focus"
                    messages={{
                      isRequired: 'Please enter a last name'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    model=".email"
                    label="Email"
                    defaultValue={String(this.props.user.bio.email)}
                    type="email"
                    errors={{ isEmail: val => !validator.isEmail(val) }}
                  />
                  <Errors
                    className="errors"
                    model=".email"
                    show="focus"
                    messages={{
                      isEmail: 'Please enter a valid email'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    model=".phone_number"
                    label="Phone Number"
                    defaultValue={String(this.props.user.bio.phone_number)}
                    type="tel"
                    errors={{ isPhoneNumber: val => !isPhoneNumber(val) }}
                  />
                  <Errors
                    className="errors"
                    model=".phone_number"
                    show="focus"
                    messages={{
                      isPhoneNumber: 'Enter a valid phone number of form: 982-004-3178'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    model=".date_of_birth"
                    label="Date of Birth"
                    type="date"
                    defaultValue={String(this.props.user.bio.date_of_birth)}
                    errors={{ isRequired: val => !val || !isValidDate(val) }}
                  />
                  <Errors
                    className="errors"
                    model=".date_of_birth"
                    show="focus"
                    messages={{
                      isRequired: 'Please enter a date of birth'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    model=".street_address"
                    label="Street Address"
                    type="text"
                    defaultValue={String(this.props.user.bio.street_address)}
                    errors={{ isRequired: val => !val }}
                  />
                  <Errors
                    className="errors"
                    model=".street_address"
                    show="focus"
                    messages={{
                      isRequired: 'Please enter a street address'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    model=".city"
                    label="City"
                    type="text"
                    defaultValue={String(this.props.user.bio.city)}
                    errors={{ isRequired: val => !val }}
                  />
                  <Errors
                    className="errors"
                    model=".city"
                    show="focus"
                    messages={{
                      isRequired: 'Please enter a city'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    model=".state"
                    label="State"
                    type="text"
                    defaultValue={String(this.props.user.bio.state)}
                    errors={{ isRequired: val => !val }}
                  />
                  <Errors
                    className="errors"
                    model=".state"
                    show="focus"
                    messages={{
                      isRequired: 'Please enter a state'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    model=".zip_code"
                    label="Zip Code"
                    type="text"
                    defaultValue={String(this.props.user.bio.zip_code)}
                    errors={{ isRequired: val => !val || !isValidZip(val) }}
                  />
                  <Errors
                    className="errors"
                    model=".zip_code"
                    show="focus"
                    messages={{
                      isRequired: 'Please enter a zip code'
                    }}
                  />
                </Fieldset>
                <br />
              </Tabs.Panel>
              <Tabs.Panel title="About You">
                <h2>Tell Us About You</h2>
                <p>
                  <b>When are you available to volunteer?</b>
                </p>
                <Fieldset model=".availability">
                  <Control.checkbox
                    component={Checkbox}
                    model=".weekday_mornings"
                    label="Weekday Mornings"
                    defaultValue={Boolean(this.props.user.availability.weekday_mornings)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".weekday_afternoons"
                    label="Weekday Afternoons"
                    defaultValue={Boolean(this.props.user.availability.weekday_afternoons)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".weekday_evenings"
                    label="Weekday Evenings"
                    defaultValue={Boolean(this.props.user.availability.weekday_evenings)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".weekend_mornings"
                    label="Weekend Mornings"
                    defaultValue={Boolean(this.props.user.availability.weekend_mornings)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".weekend_afternoons"
                    label="Weekend Afternoons"
                    defaultValue={Boolean(this.props.user.availability.weekend_afternoons)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".weekend_evenings"
                    label="Weekend Evenings"
                    defaultValue={Boolean(this.props.user.availability.weekend_evenings)}
                  />
                </Fieldset>
                <p>
                  <b>
                    In what areas do you have skills or interests that you would enjoy using to
                    support drawchange?{' '}
                  </b>
                </p>
                <Fieldset model=".skills_interests">
                  <Control.checkbox
                    component={Checkbox}
                    model=".admin_in_office"
                    label="Administrative In Office Support"
                    defaultValue={Boolean(this.props.user.skills_interests.admin_in_office)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".admin_virtual"
                    label="Administrative Virtual Support"
                    defaultValue={Boolean(this.props.user.skills_interests.admin_virtual)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".atlanta_shelter"
                    label="Atlanta Homeless Shelter Program"
                    defaultValue={Boolean(this.props.user.skills_interests.atlanta_shelter)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".orlando_shelter"
                    label="Orlando Homeless Shelter Program"
                    defaultValue={Boolean(this.props.user.skills_interests.orlando_shelter)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".graphic_web_design"
                    label="Graph/Web Design"
                    defaultValue={Boolean(this.props.user.skills_interests.graphic_web_design)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".special_events"
                    label="Special Events (planning & execution)"
                    defaultValue={Boolean(this.props.user.skills_interests.special_events)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".grant_writing"
                    label="Grant Writing"
                    defaultValue={Boolean(this.props.user.skills_interests.grant_writing)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".writing_editing"
                    label="General Writing & Editing"
                    defaultValue={Boolean(this.props.user.skills_interests.writing_editing)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".social_media"
                    label="Social Media Assistance"
                    defaultValue={Boolean(this.props.user.skills_interests.social_media)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".fundraising"
                    label="Fundraising (coordination & execution)"
                    defaultValue={Boolean(this.props.user.skills_interests.fundraising)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".finance"
                    label="Financing Assistance (Quickbooks)"
                    defaultValue={Boolean(this.props.user.skills_interests.finance)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".office_maintenance_housekeeping"
                    label="Office Maintenance & Housekeeping"
                    defaultValue={Boolean(
                      this.props.user.skills_interests.office_maintenance_housekeeping
                    )}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".international_projects"
                    label="International Projects/Trips (planning & cordinating)"
                    defaultValue={Boolean(this.props.user.skills_interests.international_projects)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".volunteer_coordination"
                    label="Volunteer Coordination"
                    defaultValue={Boolean(this.props.user.skills_interests.volunteer_coordination)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".outreach"
                    label="Outreach - Sharing with others. Start today on social media!"
                    defaultValue={Boolean(this.props.user.skills_interests.outreach)}
                  />
                </Fieldset>

                <p>
                  <b>How did you hear about drawchange?</b>
                </p>
                <Fieldset model=".referral">
                  <Control.checkbox
                    component={Checkbox}
                    model=".friend"
                    label="Friend"
                    defaultValue={Boolean(this.props.user.referral.friend)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".newsletter"
                    label="Newsletter"
                    defaultValue={Boolean(this.props.user.referral.newsletter)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".event"
                    label="Event"
                    defaultValue={Boolean(this.props.user.referral.event)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".volunteer_match"
                    label="VolunteerMatch.org"
                    defaultValue={Boolean(this.props.user.referral.volunteer_match)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".internet"
                    label="Internet Search"
                    defaultValue={Boolean(this.props.user.referral.internet)}
                  />
                  <Control.checkbox
                    component={Checkbox}
                    model=".social_media"
                    label="Social Media"
                    defaultValue={Boolean(this.props.user.referral.social_media)}
                  />
                </Fieldset>

                <Control
                  required
                  component={Text}
                  model=".bio.languages"
                  label="Please list any languages you speak, read, or write fluently (other than English.)"
                  type="text"
                  defaultValue={String(this.props.user.bio.languages)}
                  errors={{ isRequired: val => !val }}
                />
                <Errors
                  className="errors"
                  model=".bio.languages"
                  show="focus"
                  messages={{
                    isRequired: 'Please enter spoken languages'
                  }}
                />
                <Fieldset model=".history">
                  <Control
                    required
                    component={TextArea}
                    model=".volunteer_interest_cause"
                    label="Why are you interested in volunteering with drawchange?"
                    defaultValue={String(this.props.user.history.volunteer_interest_cause)}
                    errors={{ isRequired: val => !val || !(val.length >= 10) }}
                  />
                  <Errors
                    className="errors"
                    model=".volunteer_interest_cause"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid answer'
                    }}
                  />
                  <Control
                    required
                    component={TextArea}
                    model=".volunteer_support"
                    label="What would you need FROM us to support your timely completion of tasks? What supports your productivity? What sorts of recognition do you most value?"
                    defaultValue={String(this.props.user.history.volunteer_interest_cause)}
                    errors={{ isRequired: val => !val || !(val.length >= 10) }}
                  />
                  <Errors
                    className="errors"
                    model=".volunteer_support"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid answer'
                    }}
                  />
                  <Control
                    required
                    component={TextArea}
                    model=".volunteer_commitment"
                    label="What do you do when you realize you cannot keep a commitment? "
                    defaultValue={String(this.props.user.history.volunteer_commitment)}
                    errors={{ isRequired: val => !val || !(val.length >= 10) }}
                  />
                  <Errors
                    className="errors"
                    model=".volunteer_commitment"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid answer'
                    }}
                  />
                  <Control
                    required
                    component={TextArea}
                    model=".skills_qualifications"
                    label="Please summarize special skills and qualifications you have acquired from employment, previous volunteer  work, or through other activities, including hobbies or sports."
                    defaultValue={String(this.props.user.history.skills_qualifications)}
                    errors={{ isRequired: val => !val || !(val.length >= 10) }}
                  />
                  <Errors
                    className="errors"
                    model=".skills_qualifications"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid answer'
                    }}
                  />
                  <Control
                    required
                    component={TextArea}
                    model=".previous_volunteer_experience"
                    label="What are your previous volunteer experiences? Please list the organization name, city and state, position and duties. How long you were there?"
                    defaultValue={String(this.props.user.history.previous_volunteer_experience)}
                    errors={{ isRequired: val => !val || !(val.length >= 10) }}
                  />
                  <Errors
                    className="errors"
                    model=".previous_volunteer_experience"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid answer'
                    }}
                  />
                </Fieldset>
                <br />
              </Tabs.Panel>

              <Tabs.Panel title="Reference">
                <h2>Reference</h2>
                <Fieldset model=".reference">
                  <Control
                    required
                    component={Text}
                    type="text"
                    model=".name"
                    label="Reference Name"
                    defaultValue={String(this.props.user.reference.name)}
                    errors={{ isRequired: val => !val || !(val.length >= 2) }}
                  />
                  <Errors
                    className="errors"
                    model=".name"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid answer'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    type="tel"
                    model=".phone_number"
                    label="Reference Phone Number"
                    defaultValue={String(this.props.user.reference.phone_number)}
                    errors={{ isRequired: val => !val || !isPhoneNumber(val) }}
                  />
                  <Errors
                    className="errors"
                    model=".phone_number"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid phone number of form: 982-004-3178'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    type="email"
                    model=".email"
                    label="Reference Email"
                    defaultValue={String(this.props.user.reference.email)}
                    errors={{ isRequired: val => !val || !validator.isEmail(val) }}
                  />
                  <Errors
                    className="errors"
                    model=".email"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid email address'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    type="text"
                    model=".relationship"
                    label="How does this person know you?"
                    defaultValue={String(this.props.user.reference.relationship)}
                    errors={{ isRequired: val => !val || !(val.length >= 3) }}
                  />
                  <Errors
                    className="errors"
                    model=".relationship"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid answer'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    type="text"
                    model=".duration"
                    label="How long have you know this person?"
                    defaultValue={String(this.props.user.reference.duration)}
                    errors={{ isRequired: val => !val || !(val.length >= 5) }}
                  />
                  <Errors
                    className="errors"
                    model=".duration"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid answer'
                    }}
                  />
                </Fieldset>
                <br />
              </Tabs.Panel>

              <Tabs.Panel title="Emergency Contact">
                <h2>Emergency Contact</h2>
                <Fieldset model=".ice">
                  <Control
                    required
                    component={Text}
                    type="text"
                    model=".name"
                    label="Emergency Contact Name"
                    defaultValue={String(this.props.user.ice.name)}
                    errors={{ isRequired: val => !val }}
                  />
                  <Errors
                    className="errors"
                    model=".name"
                    show="focus"
                    messages={{
                      isRequired: 'This is a required field'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    type="tel"
                    model=".phone_number"
                    label="Emergency Contact Phone Number"
                    defaultValue={String(this.props.user.ice.phone_number)}
                    errors={{ isRequired: val => !val || !isPhoneNumber(val) }}
                  />
                  <Errors
                    className="errors"
                    model=".phone_number"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid phone number of form: 982-004-3178'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    type="email"
                    model=".email"
                    label="Emergency Contact Email"
                    defaultValue={String(this.props.user.ice.email)}
                    errors={{ isRequired: val => !val || !validator.isEmail(val) }}
                  />
                  <Errors
                    className="errors"
                    model=".email"
                    show="focus"
                    messages={{
                      isRequired: 'Enter a valid email address'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    type="text"
                    model=".relationship"
                    label="Relation to Emergency Contact"
                    defaultValue={String(this.props.user.ice.relationship)}
                    errors={{ isRequired: val => !val || !(val.length >= 3) }}
                  />
                  <Errors
                    className="errors"
                    model=".relationship"
                    show="focus"
                    messages={{
                      isRequired: 'This is a required field'
                    }}
                  />
                  <Control
                    required
                    component={Text}
                    type="text"
                    model=".address"
                    label="Emergency Contact Address"
                    defaultValue={String(this.props.user.ice.address)}
                    errors={{ isRequired: val => !val }}
                  />
                  <Errors
                    className="errors"
                    model=".address"
                    show="focus"
                    messages={{
                      isRequired: 'This is a required field'
                    }}
                  />
                </Fieldset>
              </Tabs.Panel>
            </Tabs>
            <p className="submitbutton">
              <Button bsStyle="primary" type="submit" /*onClick={this.props.updateProfile}*/>
                Submit Changes
              </Button>
            </p>
            <ReduxSweetAlert />
          </Form>
        </Col>
      </div>
    );
  }
}

EditProfileForm.propTypes = {
  updateProfile: PropTypes.func,
  error: PropTypes.bool,
  success: PropTypes.bool,
  swal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    error: state.auth.registrationFailed,
    success: state.auth.registrationSuccess,
    user: state.auth.user
  };
}

function mapDispatchToProps(dispatch) {
  return Object.assign(
    {},
    { swal: bindActionCreators(swal, dispatch) },
    { close: bindActionCreators(close, dispatch) },
    { updateProfile: () => dispatch(updateProfile()) }
    //    { setDefaultUser: (values) => actions.merge('user', values) },
  );
}

//const ConnectedForm = connect(null, mapDispatchToProps)(UserForm);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfileForm);
