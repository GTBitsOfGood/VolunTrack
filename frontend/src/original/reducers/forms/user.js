const user = {
  bio: {
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    date_of_birth: Date.now(),
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    password: '',
    languages: ''
  },
  history: {
    volunteer_interest_cause: '',
    volunteer_support: '',
    volunteer_commitment: '',
    skills_qualifications: '',
    previous_volunteer_experience: ''
  },
  availability: {
    weekday_mornings: false,
    weekday_afternoons: false,
    weekday_evenings: false,
    weekend_mornings: false,
    weekend_afternoons: false,
    weekend_evenings: false
  },
  skills_interests: {
    admin_in_office: false,
    admin_virtual: false,
    atlanta_shelter: false,
    orlando_shelter: false,
    graphic_web_design: false,
    special_events: false,
    grant_writing: false,
    writing_editing: false,
    social_media: false,
    fundraising: false,
    finance: false,
    office_maintenance_housekeeping: false,
    international_projects: false,
    volunteer_coordination: false,
    outreach: false
  },
  referral: {
    friend: false,
    newsletter: false,
    event: false,
    volunteer_match: false,
    internet: false,
    social_media: false
  },
  employment: {
    name: '',
    position: '',
    duration: '',
    location: '',
    previous_name: '',
    previous_reason_for_leaving: '',
    previous_location: ''
  },
  reference: {
    name: '',
    phone_number: '',
    email: '',
    relationship: '',
    duration: ''
  },
  criminal: {
    felony: false,
    sexual_violent: false,
    drugs: false,
    driving: false,
    explanation: 'n/a'
  },
  ice: {
    name: '',
    relationship: '',
    phone_number: '',
    email: '',
    address: ''
  },
  permissions: {
    comments: 'n/a',
    reference: false,
    personal_image: false,
    email_list: false,
    signature: ''
  }
};

export default user;
