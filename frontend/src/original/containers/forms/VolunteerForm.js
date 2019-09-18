import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Control, Form, actions, Fieldset, Errors } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';
import validator from 'validator';
import ScrollUpButton from 'react-scroll-up-button';

var isPhoneNumber = require('is-phone-number');
var isValidZip = require('is-valid-zip');
var isValidDate = require('is-valid-date');

// Local Components
import { register } from '../../actions/auth';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import Text from '../../components/inputs/Text';
import TextArea from '../../components/inputs/Textarea';
import Checkbox from '../../components/inputs/Checkbox';
import '../../assets/stylesheets/ItemDisplay.css';
import '../../assets/stylesheets/react-simpletabs.css';
import { isRequired, isLong } from './Validation';
import Logo from '../../assets/images/drawchange_logo.png';
class VolunteerForm extends Component {
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
          <Image style={{ paddingLeft: '33%' }} src={Logo} />
          <p>
            Thank you for your interest in volunteering with us! You can volunteer to help us with a
            specific project, event, going to the homeless shelters with us or helping us out around
            the office. Whatever it is, you are guaranteed to leave with a full heart and ear to ear
            smile!
          </p>
          <p>
            While we greatly need and appreciate all of the volunteer assistance we receive, we do
            not have a full time volunteer manager on staff. Thank you in advance for understanding
            that your application may take a few weeks to get processed.
          </p>

          <Form model="forms.user" onSubmit={v => console.log(v)}>
            <h2 id="PersonalInformation">Personal Information</h2>

            <Fieldset model=".bio">
              <div>
                <Control
                  required
                  component={Text}
                  model=".first_name"
                  label="First Name"
                  placeholder="First Name"
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
                placeholder="Last Name"
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
                placeholder="Email"
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
                model=".password"
                label="Password"
                placeholder="Password"
                type="password"
                errors={{ isRequired: val => !val || !(val.length >= 5) }}
              />
              <Errors
                className="errors"
                model=".password"
                show="focus"
                messages={{
                  isRequired: 'Please enter a valid password'
                }}
              />
              <Control
                required
                component={Text}
                model=".phone_number"
                label="Phone Number"
                placeholder="982-004-3178"
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
                placeholder="2017-11-27"
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
                placeholder="711 Techwood Dr NW"
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
                placeholder="Atlanta"
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
                placeholder="GA"
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
                placeholder="30318"
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

            <h2 id="TellUsAboutYou">Tell Us About You</h2>
            <p>
              <b>When are you available to volunteer?</b>
            </p>
            <Fieldset model=".availability">
              <Control.checkbox
                component={Checkbox}
                model=".weekday_mornings"
                label="Weekday Mornings"
              />
              <Control.checkbox
                component={Checkbox}
                model=".weekday_afternoons"
                label="Weekday Afternoons"
              />
              <Control.checkbox
                component={Checkbox}
                model=".weekday_evenings"
                label="Weekday Evenings"
              />
              <Control.checkbox
                component={Checkbox}
                model=".weekend_mornings"
                label="Weekend Mornings"
              />
              <Control.checkbox
                component={Checkbox}
                model=".weekend_afternoons"
                label="Weekend Afternoons"
              />
              <Control.checkbox
                component={Checkbox}
                model=".weekend_evenings"
                label="Weekend Evenings"
              />
            </Fieldset>
            <p>
              <b>
                In what areas do you have skills or interests that you would enjoy using to support
                drawchange?{' '}
              </b>
            </p>
            <Fieldset model=".skills_interests">
              <Control.checkbox
                component={Checkbox}
                model=".admin_in_office"
                label="Administrative In Office Support"
              />
              <Control.checkbox
                component={Checkbox}
                model=".admin_virtual"
                label="Administrative Virtual Support"
              />
              <Control.checkbox
                component={Checkbox}
                model=".atlanta_shelter"
                label="Atlanta Homeless Shelter Program"
              />
              <Control.checkbox
                component={Checkbox}
                model=".orlando_shelter"
                label="Orlando Homeless Shelter Program"
              />
              <Control.checkbox
                component={Checkbox}
                model=".graphic_web_design"
                label="Graph/Web Design"
              />
              <Control.checkbox
                component={Checkbox}
                model=".special_events"
                label="Special Events (planning & execution)"
              />
              <Control.checkbox component={Checkbox} model=".grant_writing" label="Grant Writing" />
              <Control.checkbox
                component={Checkbox}
                model=".writing_editing"
                label="General Writing & Editing"
              />
              <Control.checkbox
                component={Checkbox}
                model=".social_media"
                label="Social Media Assistance"
              />
              <Control.checkbox
                component={Checkbox}
                model=".fundraising"
                label="Fundraising (coordination & execution)"
              />
              <Control.checkbox
                component={Checkbox}
                model=".finance"
                label="Financing Assistance (Quickbooks)"
              />
              <Control.checkbox
                component={Checkbox}
                model=".office_maintenance_housekeeping"
                label="Office Maintenance & Housekeeping"
              />
              <Control.checkbox
                component={Checkbox}
                model=".international_projects"
                label="International Projects/Trips (planning & cordinating)"
              />
              <Control.checkbox
                component={Checkbox}
                model=".volunteer_coordination"
                label="Volunteer Coordination"
              />
              <Control.checkbox
                component={Checkbox}
                model=".outreach"
                label="Outreach - Sharing with others. Start today on social media!"
              />
            </Fieldset>

            <p>
              <b>How did you hear about drawchange?</b>
            </p>
            <Fieldset model=".referral">
              <Control.checkbox component={Checkbox} model=".friend" label="Friend" />
              <Control.checkbox component={Checkbox} model=".newsletter" label="Newsletter" />
              <Control.checkbox component={Checkbox} model=".event" label="Event" />
              <Control.checkbox
                component={Checkbox}
                model=".volunteer_match"
                label="VolunteerMatch.org"
              />
              <Control.checkbox component={Checkbox} model=".internet" label="Internet Search" />
              <Control.checkbox component={Checkbox} model=".social_media" label="Social Media" />
            </Fieldset>

            <Control
              required
              component={Text}
              model=".bio.languages"
              label="Please list any languages you speak, read, or write fluently (other than English.)"
              type="text"
              placeholder="Languages"
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
                placeholder="support"
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
                placeholder="commitment"
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
                placeholder="skills and qualifications"
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
                placeholder="previous volunteer experience"
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

            <h2 id="EmploymentHistory">Employment History</h2>
            <Fieldset model=".employment">
              <Control
                required
                component={Text}
                type="text"
                model=".name"
                label="Current employer's name"
                placeholder="current employer's name "
                errors={{ isRequired: val => !val || !(val.length >= 5) }}
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
                type="text"
                model=".position"
                label="Position at current employer"
                placeholder="position at current employer"
                errors={{ isRequired: val => !val || !(val.length >= 2) }}
              />
              <Errors
                className="errors"
                model=".position"
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
                label="How long have you been with this current employer?"
                placeholder="duration"
                errors={{ isRequired: val => !val || !(val.length >= 2) }}
              />
              <Errors
                className="errors"
                model=".duration"
                show="focus"
                messages={{
                  isRequired: 'Enter a valid answer'
                }}
              />
              <Control
                required
                component={Text}
                type="text"
                model=".location"
                label="Current employer's city and state"
                placeholder="location"
                errors={{ isRequired: val => !val || !(val.length >= 2) }}
              />
              <Errors
                className="errors"
                model=".location"
                show="focus"
                messages={{
                  isRequired: 'Enter a valid answer'
                }}
              />
              <Control
                required
                component={Text}
                type="text"
                model=".previous_name"
                label="Previous employer's name"
                placeholder="previous employer's name"
                errors={{ isRequired: val => !val || !(val.length >= 2) }}
              />
              <Errors
                className="errors"
                model=".previous_name"
                show="focus"
                messages={{
                  isRequired: 'Enter a valid answer'
                }}
              />
              <Control
                required
                component={Text}
                type="text"
                model=".previous_location"
                label="Previous employer's city and state"
                placeholder="previous location?"
                errors={{ isRequired: val => !val || !(val.length >= 2) }}
              />
              <Errors
                className="errors"
                model=".previous_location"
                show="focus"
                messages={{
                  isRequired: 'Enter a valid answer'
                }}
              />
              <Control
                required
                component={Text}
                type="text"
                model=".previous_reason_for_leaving"
                label="Why did you leave this employer?"
                placeholder="previous reason for leaving?"
                errors={{ isRequired: val => !val || !(val.length >= 2) }}
              />
              <Errors
                className="errors"
                model=".previous_reason_for_leaving"
                show="focus"
                messages={{
                  isRequired: 'Enter a valid answer'
                }}
              />
            </Fieldset>
            <br />

            <h2 id="Reference">Reference</h2>
            <Fieldset model=".reference">
              <Control
                required
                component={Text}
                type="text"
                model=".name"
                label="Reference Name"
                placeholder="reference name"
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
                placeholder="982-004-45613"
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
                placeholder="randome@random.com"
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
                placeholder="relationship"
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
                placeholder="duration"
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

            <h2 id="CriminalHistory">Criminal History</h2>
            <Fieldset model=".criminal">
              <p>
                <b>Please indicate if you have been convicted of any of the following.</b>
              </p>
              <Control.checkbox component={Checkbox} model=".felony" label="A felony" />
              <Control.checkbox
                component={Checkbox}
                model=".sexual_violent"
                label="Any crime involving a sexual offense, an assault or the use of a weapon? "
              />
              <Control.checkbox
                component={Checkbox}
                model=".drugs"
                label="Any crime involving the use, possession, or the furnishing of drugs or hypodermic syringes?"
              />
              <Control.checkbox
                component={Checkbox}
                model=".driving"
                label="Reckless driving, operating a motor vehicle while under the influence, or driving to endanger? "
              />
              <Control
                required
                component={Text}
                type="text"
                model=".explanation"
                label="If you indicated yes to any of the above please explain and list when the offense occured."
              />
            </Fieldset>
            <br />

            <h2 id="EmergencyContact">Emergency Contact</h2>
            <Fieldset model=".ice">
              <Control
                required
                component={Text}
                type="text"
                model=".name"
                label="Emergency Contact Name"
                placeholder="Emergency Contact Name"
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
                placeholder="Emergency Contact Number"
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
                placeholder="Emergency Contact Email"
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
                placeholder="Emergency Contact Relation"
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
                placeholder="Emergency Contact Address"
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

            <Fieldset model=".permissions">
              <br />
              <h2 id="AdditionalComments">Additional Comments</h2>
              <Control
                required
                component={Text}
                type="text"
                model=".comments"
                label="Is there anything else we should know about you? Any Questions, Comments, or Concerns?"
              />
              <br />
              <h2 id="Permissions">Permissions</h2>
              <p>
                <b>drawchange has my permission to:</b>
              </p>

              <Control.checkbox
                component={Checkbox}
                model=".reference"
                label="Verify the reference I have provided"
              />
              <Control.checkbox
                component={Checkbox}
                model=".personal_image"
                label="Include my name and/or picture in drawchange promotional materials, newspapers, TV, radio, brochures, videos, website(s), etc"
              />
              <Control.checkbox
                component={Checkbox}
                model=".email_list"
                label="Add me to their mailing list. (We only send 1 email per month and never share your email address)"
              />
              <p>
                By submitting this application, I affirm that the facts set forth in it are true and
                complete. I understand that if I am accepted as a volunteer, any false statements,
                omissions, or other misrepresentations made by me on this application may result in
                my immediate dismissal.
              </p>
              <Control
                required
                component={Text}
                type="text"
                model=".signature"
                label="Please enter your full legal name here, to confirm agreement."
                errors={{ isRequired: val => !val || !(val.length >= 3) }}
              />
              <Errors
                className="errors"
                model=".signature"
                show="focus"
                messages={{
                  isRequired: 'This is a required field'
                }}
              />
            </Fieldset>

            <p className="submitbutton">
              <Button bsStyle="primary" type="submit" onClick={this.props.register}>
                Submit Volunteer Application
              </Button>
            </p>
            <ReduxSweetAlert />
            <ScrollUpButton />
          </Form>
        </Col>
      </div>
    );
  }
}

VolunteerForm.propTypes = {
  register: PropTypes.func,
  error: PropTypes.bool,
  success: PropTypes.bool,
  swal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    error: state.auth.registrationFailed,
    success: state.auth.registrationSuccess
  };
}

function mapDispatchToProps(dispatch) {
  return Object.assign(
    {},
    { swal: bindActionCreators(swal, dispatch) },
    { close: bindActionCreators(close, dispatch) },
    { register: () => dispatch(register()) }
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VolunteerForm);
